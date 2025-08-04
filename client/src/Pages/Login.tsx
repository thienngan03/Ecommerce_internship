
import React from "react";
import { useEffect } from "react";
import {useAuth} from "../Hooks/useAuth.tsx"; // Adjust the import path as necessary
import { useNavigate } from "react-router";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons";


import hero from "../Components/Assets/hero.png";
import "./Login.css"; // Assuming you have a CSS file for styling

const LogIn = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isAuthenticated, loading, error, user } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    await login(email, password);
  }
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'seller') { 
        navigate('/sellerDashboard');
      } else if (user?.role === 'buyer') {
        navigate('/home');
      } else if (user?.role === undefined) {
        navigate('/'); // Redirect to home or another page if role is not defined
      } else {
        setErrorMessage("Invalid user role");
    }
  } else if (error) {
      setErrorMessage(error);
    }
  }, [isAuthenticated,user,error, navigate]);
  // const [signUp] = useAuth();
  return (
    <div className="Login">
      <div className="div-2">
        <header className="header">
          <div className="logo">
            <p className="exclusive">
            </p>
          </div>  
        </header>

        <div className="frame-6">
          <div className="side-image">
            <img
              className="dl-beatsnoop"
              alt="Dl beatsnoop"
              src={hero}
            />
          </div>

          <div className="frame-7">
            <div className="frame-8">
              <div className="frame-9">
                <p className="Login-to-ecommerce">
                  <span className="text-wrapper-5">Log in to </span>

                  <span className="text-wrapper-6">E</span>

                  <span className="text-wrapper-7">Commerce</span>
                </p>

                <div className="text-wrapper-8">Enter your details below</div>
              </div>
              <form className="login_form" onSubmit={handleLogin}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="toggle-password-icon"
                    />
                  </button>
                </div>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="login-button" disabled={loading} >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>
            </div>

            <div className="frame-5">
              <p className="p">Don’t have an account ?</p>
              <button className="sign-up-button" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
