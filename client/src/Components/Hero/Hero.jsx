import React from "react";
import "./Hero.css"; 
import {faStar, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import image from "../Assets/hero.png"; // Adjust the path as necessary

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2 className="hero-title">Welcome to Our E-Shop</h2>
          <div>
            <div className="star-icon">
              <p>New Collections for everyone</p>
              <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
          <div className="hero-lastest-btn">
            <div>Last collection</div>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
      </div>
      <div className="hero-right">
        <img src={image} alt="Hero" className="hero-image" />
      </div>
    </div>
  );
};

export default Hero;
