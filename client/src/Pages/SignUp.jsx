import {useEffect, useState } from 'react';
import { useAuth } from '../Hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import hero from "../Components/Assets/hero.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons";


import '../Pages/SignUp.css'; // Assuming you have a CSS file for styling

const SignUp = () => {
  const { register, login, user, isAuthenticated, error} = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('noRole');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }



  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password ) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (role === 'noRole') {
      setErrorMessage('Please select a role');
      return;
    }

    try {
      const response = await register(email, password, role);
      if (response) {
        const loginResponse = await login(email, password);
        if (loginResponse && loginResponse.accessToken) {
          navigate('/'); // Redirect to home page after successful login
        } else {
          setErrorMessage('Sign up successful! Please log in.');
        }
      } else {
        setErrorMessage(response.message || 'Sign in failed');
      }
    } catch (err) {
      setErrorMessage('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'seller') { 
        navigate('/sellerDashboard');
      } else if (user?.role === 'buyer') {
        navigate('/buyer/createBuyer'); // Redirect to create buyer account page
      } else if (user?.role === undefined) {
        navigate('/'); // Redirect to home or another page if role is not defined
      } else {
        setErrorMessage("Invalid user role");
    }
  } else if (error) {
      setErrorMessage(error);
    }
  }, [isAuthenticated,user,error, navigate]);

  return (
 <div className="SignUp">
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
                <p className="SignUp-to-ecommerce">
                  <span className="text-wrapper-5">Sign up to </span>

                  <span className="text-wrapper-6">E</span>

                  <span className="text-wrapper-7">Commerce</span>
                </p>

                <div className="text-wrapper-8">Enter your details below</div>
              </div>
              <form className="SignUp_form" onSubmit={handleSignUp}>
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
                <div className="role">
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Choose your role" >
                      Choose your role
                    </option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="SignUp-button" disabled={loading} >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>

            <div className="frame-5">
              <p className="p">Already have an account ?</p>
              <button className="sign-up-button" onClick={() => navigate('/login')}>
                logIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
