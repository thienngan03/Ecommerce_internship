
import "./Cart.css"

import { useEffect, useState } from "react";
import { useAuth } from "../../Hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { getCartsByBuyerId, updateCart,prepareTransaction, checkout, checkTrans } from "../../Api/buyerAPI.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel } from "@fortawesome/free-solid-svg-icons";

export const Cart = () => {
  const { isAuthenticated, loading, buyerId } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [bank_type, setBankType] = useState("");
  const [payment, setPayment] = useState("");
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthenticated && buyerId) {
        setLoadingCart(true);
        try {  
             setTimeout(async() => {
                const data = await getCartsByBuyerId(buyerId);
                setCartItems(data.carts || []);
                setProducts(data.products || []);
                setShops(data.shops || []);
                setProductIds([]);
                setCheckAll(false);
                setLoadingCart(false);
                localStorage.setItem("cartCount", (data.carts.length).toString());
             }, 1000);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }

    };
    fetchCartItems();
  }, [isAuthenticated, buyerId, navigate]);

  if (loading || loadingCart) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated ) {
    navigate('/login');
  }
  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }
  if(loadingCheckout) {
    return <div>Processing...</div>;
  }

  const handleUpdateCart = async (productId, quantity) => {
    setLoadingCart(true);
    try {
      const updatedCart = {
        productId,
        quantity
      }

      const response = await updateCart(buyerId, updatedCart);
      if (response) {
        setLoadingCart(false);
        const newCartItems = await getCartsByBuyerId(buyerId);
        setCartItems(newCartItems.carts || []);
        localStorage.setItem("cartCount", (newCartItems.carts.length).toString());
      } else {
        console.error("Error updating cart:", response.message);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleCheckout = async() => {
    setLoadingCheckout(true);
    if(payment === "") {
      alert("Please select a payment method before proceeding to checkout.");
      return;
    }
    if(productIds.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }
    if (payment === "card" && bank_type === "") {
      alert("Please select a bank type for card payment.");
      return;
    }
    
    if (isAuthenticated && buyerId) {
      try {
          const orderData = {
              productIds: productIds,
              paymentMethod: payment
            }
          const order = await checkout(buyerId, orderData);
          if (!order) {
            alert("Checkout failed. Please try again.");
            return;
          }
        const oldCartCount = parseInt(localStorage.getItem("cartCount")) || 0;
        localStorage.setItem("cartCount", (oldCartCount - productIds.length).toString());
        if (payment === "cash") {
          setLoadingCheckout(false);
          alert("Checkout successful! Please pay in cash upon delivery.");
          navigate('/buyer/order');
          return;
        }
        const transactionData = {
          totalPrice: order.order.totalPrice,
          orderId: order.order.id,
          bank_type: bank_type
        };

        const response = await prepareTransaction(buyerId, transactionData);
        setLoadingCheckout(false);
        if (response) {
          window.location= response.result.data.payment_url;

          await checkTrans(buyerId, order.order.id, response.result.data.payment_url);
        } else {
          alert("Checkout failed: " + response.message);
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Checkout failed. Please try again.");
      }
    } else {
      alert("Please log in to proceed with checkout.");
      navigate('/login');
    }
  };
    const handleClickCard = (productId) => {

      navigate(`/products/${productId}`); // Replace '1' with the actual product ID
    }

  return (
    <div className="cart">
      <form className="div-2">
        <div className="text-wrapper-5">Cart</div>
        <div className="overlap">
          <div className="cart-header">
            <input type ="checkbox" className="checkbox" checked={checkAll} onChange={(e) => {
              const isChecked = e.target.checked;
              setCheckAll(isChecked);
              setProductIds(isChecked ? products.map(p => p.id) : []);
            }} />
            <div className="text-wrapper-1">Select All</div>

          </div>
        </div>
        <div className="overlap-2">
        {cartItems.map((cartItem, index) => {
          const product = products.find(p => p.id === cartItem.productId);
          const shop = shops.find(s => s.id === product?.shopId);
          return (
            <div className="cart-item" key={index}>
              <div className="cart-item-details">
                <input type="checkbox" className="checkbox-item" checked={checkAll ? true : productIds.includes(product.id)} onChange={() => setProductIds(prev => {
                  if (prev.includes(product.id)) {
                    setCheckAll(false);
                    return prev.filter(id => id !== product.id);
                  }
                  return [...prev, product.id];
                })} />
                <img
                  className="product-image"
                  src={product?.imageUrl || "placeholder.png"}
                  alt={product?.name || "Product Image"}
                  onClick={() => handleClickCard(product.id)}
                />
                <div className="cart-item-info">
                  <div className="text-wrapper">{product?.name || "Product Name"}</div>
                  <div className="text-wrapper-3">Price: ${product?.price || "0.00"}</div>
                  <div className="text-wrapper-6">Shop: {shop?.name || "Unknown Shop"}</div>
                  <div className="text-wrapper-4">Quantity: {cartItem.quantity || 1}</div>
                  <div className="text-wrapper-1">Subtotal: ${(product?.price || 0) * (cartItem.quantity || 1)}</div>
                </div>
              </div>
              <div className="cart-item-actions">
                <button 
                  className="decrease-button" 
                  onClick={() => handleUpdateCart(cartItem.productId, cartItem.quantity-1 )}
                >-</button>
                <span>{cartItem.quantity}</span>
                <button 
                  className="increase-button" 
                  onClick={() => handleUpdateCart(cartItem.productId, cartItem.quantity + 1)}
                >+</button>
                <FontAwesomeIcon 
                  icon={faCancel} 
                  className="icon-cancel" 
                  onClick={() => {
                    updateCart(buyerId, { productId: cartItem.productId, quantity: 0 });
                    setCartItems(cartItems.filter(item => item.productId !== cartItem.productId));
                  }} 
                />
              </div>
            </div>
          );
        })}
        </div>
      </form>
      <div className="cart-summary">
        <div className="summary-item">
          <div className="text-wrapper-7">Total Items:</div>
          <div className="text-wrapper-8">{productIds.length}</div>
        </div>
        <div className="summary-item">
          <div className="text-wrapper-9">Total Price:</div>
          <div className="text-wrapper-10">
            ${cartItems.reduce((total, item) => {
              if (!productIds.includes(item.productId)) return total;
              const product = products.find(p => p.id === item.productId);
              return total + (product?.price || 0) * (item.quantity || 1);
            }, 0).toFixed(2)}

          </div>
        </div>
        <div className="option_payment">
          <div className="text-wrapper-11">Payment Method:</div>
          <select value={payment} onChange={(e) => setPayment(e.target.value)} className="payment-select">
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="card">ATM Card</option>
          </select>
        </div>
        {payment === "card" && (
          <div className="option_payment">
            <div className="text-wrapper-11">Bank Type:</div>
            <select value={bank_type} onChange={(e) => setBankType(e.target.value)} className="bank-select">
              <option value="">Select Bank</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
          </div>
        )}
      </div>

        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
  );
};

export default Cart;