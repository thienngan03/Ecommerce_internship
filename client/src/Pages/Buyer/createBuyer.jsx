import "./createBuyer.css";

import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { createBuyer } from "../../Api/buyerAPI.jsx";
import heroImage from "../../Components/Assets/hero.png";

export const CreateBuyer = () => {
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
        if (user && user.role !== 'buyer') {
            navigate("/signup"); // Redirect if the user is not a buyer
        }
    }, [isAuthenticated, user, navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone || !address) {
            setErrorMessage('Please fill in all fields');
            return;
        }
        try {
            const response = await createBuyer({ name, phone, address }, user.id);
            if (response) {

                navigate('/home'); // Redirect to home page after successful creation
            } else {
                setErrorMessage('Failed to create buyer account');
            }
        } catch (error) {
            console.error("Error creating buyer:", error);
            setErrorMessage('An error occurred while creating the buyer account');
        }
    };
    
    return (
        <div className="create-buyer">
            <div className="left-container">
                <img src={heroImage} alt="logo"/>
            </div>
            <div className="right-container">
                <form onSubmit={handleSubmit} className="form-container">
                    <h1 style={{ fontSize: "30px", color: "#000" }}>Create Account for Buyer</h1>
                    <h2 style={{ fontSize: "16px", color: "#000" }}>Enter your details</h2>
                    <div className="input-container">
                        <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="tel" placeholder="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type="text" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" className="create-account-btn" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default CreateBuyer;