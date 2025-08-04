import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// import {useState, useEffect} from "react";
// import {useAuth} from "../../Hooks/useAuth.tsx";
import PropTypes from 'prop-types';


import "./productCard.css";

export const ProductCard = ({ productId, productName, productImage, productPrice }) => {
    const navigate = useNavigate();

    
    // const renderStars = (rating) => {
    //     const stars = [];
    //     for (let i = 0; i < 5; i++) {
    //         stars.push(
    //             <FontAwesomeIcon
    //                 key={i}
    //                 icon={i < rating ? "star" : "star-half-alt"}
    //                 className="star"
    //             />
    //         );
    //     }
    //     return stars;
    // };
    // const handleAddToCart = () => {
    //     if (user) {
    //         // Logic to add the product to the cart
    //         console.log("Product added to cart");
    //     } else {
    //         navigate("/login");
    //     }
    // };
    const handleClickCard = () => {

            navigate(`/products/${productId}`); // Replace '1' with the actual product ID
    }

    return (
        <div className="card" data-testid="product-card" onClick={handleClickCard}>
            <div className="cart-with-flat">
                <div className="frame">
                    <div className="overlap-group">
                        <div className="g-x-wrapper">
                            <img className="g-x" alt="G x" src={productImage} />
                        </div>
                    </div>
                </div>
                <div className="div">
                    <div className="text-wrapper">{productName}</div>
                    <div className="frame-2">
                        <div className="text-wrapper-2">${productPrice}</div>
                        <div className="text-wrapper-3">${productPrice * 1.2}</div>
                    </div>

                <div className="frame-3">
                    <div className="text-wrapper-4">(88)</div>
                </div>
            </div>
        </div>
    </div>
        
  
    );
};
ProductCard.propTypes = {
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productImage: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
};