import "./BuyerMenu.css"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth.tsx";

const BuyerMenu = () => {
    const { isAuthenticated, loading } = useAuth();
    const [buyerMenu, setBuyerMenu] = useState(null);
    const navigate = useNavigate();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }
    return (
        <div className="buyer-menu">
            <div className="text">
                <h3>Manage Account</h3>
            </div>
            <div className="manage-menu">
                {/* <div
                className={buyerMenu === "profile" ? "active" : "inactive"}
                onClick={() => setBuyerMenu("profile")}
                >
                Profile
                </div>
                <div
                className={buyerMenu === "shipping" ? "active" : "inactive"}
                onClick={() => setBuyerMenu("shipping")}
                >
                Manage Shipping Information
                </div> */}
                <Link
                to={`/buyer/account`}
                onClick={() => setBuyerMenu("changePassword")}
                className={buyerMenu === "changePassword" ? "active" : "inactive"}
                >
                Change Password
                </Link>
            </div>
            <Link
                to={`/buyer/order`}
                onClick={() => setBuyerMenu("order")}
                className={`order-link ${buyerMenu === "order" ? "active" : "inactive"}`}
            >
                Order Management
            </Link>
        </div>

    );
}
export default BuyerMenu;