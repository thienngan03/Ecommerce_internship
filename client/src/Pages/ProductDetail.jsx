import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faStore, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import { getProductById,getShopById } from "../Api/guestAPI.jsx";
import { addToCart } from "../Api/buyerAPI.jsx";    
// import {}
import "./ProductDetail.css";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, loading,buyerId} = useAuth();
  const navigate = useNavigate();

  const productId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProductById(productId);
        const formattedProduct = {
          id: data.id,
          shopId: data.shopId,
          name: data.name,
          image: data.imageUrl,
          description: data.description,
          price: data.price,
          stock: data.stock, // ensure this field is returned by API
        };


        const shopData = await getShopById(data.shopId); // await this
        const formattedShop = {
          id: shopData.id,
          name: shopData.name,
          description: shopData.description,
          avatarUrl: shopData.avatarUrl,
        };
                setProduct(formattedProduct);
        setShop(formattedShop);
      } catch (error) {
        console.error("Error fetching product or shop details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  
    if (loading) {
    return <div>Loading...</div>;
  }
    if (!product) {
    return <div>Loading...</div>;
  }
  const handleShopClick = () => {
    if (shop) {
      navigate(`/shops/${shop.id}`);
    }
  };
  const handleAddToCart = async () => {
    if (isAuthenticated) {
     try {
        const cartData = {
          productId: product.id,
          quantity: quantity,
        };
        const response = await addToCart(buyerId, cartData);
        if (response) {
          alert("Product added to cart successfully!");
          // Optionally, you can update the cart count in the auth context or local storage
          // setCartCount(prevCount => prevCount + quantity);
          if (!response.isExit) {
            const currentCount = parseInt(localStorage.getItem("cartCount")) || 0;
            localStorage.setItem("cartCount", (currentCount + 1).toString());
          }
          navigate(`/buyer/cart`);
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Failed to add product to cart.");
      }
    } else {
      alert("Please log in to add products to your cart.");
      navigate('/login');
      return;
    }
  };

  return (
    <div className="product-details-page">
      <div className="div">
        <hr className="line-3" />
        <div className="frame">
          <div className="image-wrapper">
            <img className="image" alt="" src={product.image} />
          </div>

       <div className="frame-2">
         <div className="frame-3">
           <div className="frame-4">
             <div className="text-wrapper">{product.name}</div>

             <div className="frame-5">
               <div className="frame-6">
                 <div className="text-wrapper-2">(150 Reviews)</div>
               </div>

               <div className="frame-7">

                 <div className="text-wrapper-3">{product.stock > 0? 'In Stock' : 'Out of Stock'}</div>
               </div>
             </div>

             <div className="text-wrapper-4">${product.price}</div>
           </div>

          <p className="playstation">
            {product.description}
          </p>
        </div>

        <div className="frame-wrapper">
          <div className="frame-8">
            <div className="icon-minus-wrapper">
                <button className="decrease-button" onClick={() => setQuantity(quantity - 1)} disabled={quantity === 1}>-</button>
            </div>

            <div className="div-wrapper">
              <div className="text-wrapper-5">{quantity}</div>
            </div>

            <div className="icon-plus-wrapper">
              <button className="increase-button" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
        </div>

        <div className="frame-9">
          <div className="button-2">
            <FontAwesomeIcon
              icon={faShoppingCart}
                  className="icon-instance-node"
                  color="#000282"
                />
                 <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-14">
          <img className="image-2" alt="" src={shop?.avatarUrl} />

          <div className="frame-15">
            <div className="frame-16">
              <div className="frame-17">
                <div className="text-wrapper-9">{shop?.name}</div>
              </div>

              {/* <StarRating
                className="star-rating-instance"
                fill
                prop="three"
                size="medium"
                starColor="#FDD412"
                starFill="#FDD412"
              /> */}
            </div>

            <div className="frame-18">
              {/* <div className="button-3">
                <ChatText className="icon-instance-node" />
                <div className="text-wrapper-6">Chat Now</div>
              </div> */}

              <button onClick={handleShopClick} className="view-shop-button">
                <FontAwesomeIcon icon={faStore} /> View Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
