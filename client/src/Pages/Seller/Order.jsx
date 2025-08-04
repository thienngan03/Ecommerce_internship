import "./Order.css"
import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { getOrdersByShopId, updateOrderStatus } from "../../Api/sellerAPI.jsx";
import SellerMenu from "../../Components/SellerMenu.jsx";

const Order = () => {
    const { isAuthenticated, shopId, loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuthenticated || !shopId) {
        navigate("/login");
        } else {
        const fetchOrders = async () => {
            try {
            const data = await getOrdersByShopId(shopId);
            setOrders(data);
            } catch (error) {
            console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
        }
    }, [isAuthenticated, shopId, navigate]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
        await updateOrderStatus(shopId, orderId, { status });
        alert("Order status updated successfully");
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        ));
        } catch (error) {
        console.error("Error updating order status:", error);
        }
    };
    
    return (
        <div className="order-page">
        <SellerMenu />

        <div className="order-list">
            {orders.map((order) => (
            <div key={order.id} className="order-item">
                <h2>Order ID: {order.id}</h2>
                <p>Status: {order.status}</p>
                {order.status === 'pending' && (
                    <>
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}>Shipped</button>
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'canceled')}>Canceled</button>
                    </>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}
export default Order;
