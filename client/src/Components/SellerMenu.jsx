import "./SellerMenu.css"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth.tsx";

const SellerMenu = () => {
    const { isAuthenticated, loading } = useAuth();
    const [sellerMenu, setSellerMenu] = useState(null);
    const navigate = useNavigate();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }
    return (
        <div className="seller-menu">
            <div className="text">
                <h3>Shop Management</h3>
            </div>
            <div className="manage-menu">
                <Link
                to={`/seller/product`}
                onClick={() => setSellerMenu("product")}
                className={sellerMenu === "product" ? "active" : "inactive"}
                >
                Product Management
                </Link>
                <Link
                to={`/seller/category`}
                onClick={() => setSellerMenu("category")}
                className={sellerMenu === "category" ? "active" : "inactive"}
                >
                Category Management
                </Link>
                <Link
                to={`/seller/order`}
                onClick={() => setSellerMenu("order")}
                className={sellerMenu === "order" ? "active" : "inactive"}
                >
                Order Management
                </Link>
            </div>
            <Link
                to={`/seller/account`}
                onClick={() => setSellerMenu("changePassword")}
                className={`order-link ${sellerMenu === "changePassword" ? "active" : "inactive"}`}
            >
                Change Password
            </Link>
        </div>

    );
}
export default SellerMenu;