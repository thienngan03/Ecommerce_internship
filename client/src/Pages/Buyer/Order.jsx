
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth.tsx';
import { getOrdersByBuyerId } from '../../Api/buyerAPI.jsx'
import BuyerMenu from '../../Components/BuyerMenu.jsx';

import './Order.css';

export const Order = () => {
    const { isAuthenticated, loading,buyerId} = useAuth();
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();
  useEffect(() => {
          const fetchOrders = async () => {
              if (isAuthenticated && buyerId) {
                  try {
                      const data = await getOrdersByBuyerId(buyerId);
                      setOrders(data || []);
                  } catch (error) {
                      console.error("Error fetching orders:", error);
                  }
              }
          };
          fetchOrders();
  }, [isAuthenticated, buyerId]);
       
  if (loading) {
      return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
      navigate("/login");
      return null;
  }

  return (
    <div className="order">
      <BuyerMenu />
      <div className="div-2">
          <div className="overlap-1">
          {orders.map((order, index) => {
              return (
                  <div className="order-item" key={index}>
                      <div className="order-details">
                        <div className="order-header">
                          <div className="text-8">Order ID: {order.id}</div>
                          <div className="text-10">{order.status}</div>
                        </div>

                        {order.orderDetails.map((orderDetail, detailIndex) => {
                          return (
                                <div key={detailIndex} className="cart-item">
                                  <div className="cart-item-details">
                                    <img
                                      className="product-image"
                                      src={orderDetail.product?.imageUrl || "placeholder.png"}
                                      alt={orderDetail.product?.name || "Product Image"}
                                    />
                                    <div className="cart-item-info">
                                      <div className="text-3">{orderDetail.product?.name || "Product Name"}</div>
                                      <div className="text-3">Price: ${orderDetail.product?.price || "0.00"}</div>
                                      <div className="text-6">Shop: {orderDetail.product?.shop?.name || "Unknown Shop"}</div>
                                      <div className="text-4">Quantity: {orderDetail.quantity || 1}</div>
                                    </div>
                                  </div>
                                    <div className="cart-price">

                                      <div className="text-1"> ${(orderDetail.price || 0) * (orderDetail.quantity || 1)}</div>

                                    </div>
                                </div>
                              );
                            })}
                          
                          <div className="text-9">Total: ${order.totalPrice}</div>
                          <div className="text-9">Order Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    
                  </div>
                  
              );       
          })}
          </div>
        </div>

    </div>
  );
};
export default Order;