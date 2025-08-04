
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth.tsx';
import { changePasswordRequest } from '../../Api/authAPI.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import SellerMenu from '../../Components/SellerMenu.jsx';
import './Account.css';

export const Account = () => {
    const { isAuthenticated, loading, user, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState({
         oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const handleChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
      if(!isAuthenticated) {
        navigate("/login");
        return;
      }
      e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }
        try {
            await changePasswordRequest(user.id, password.oldPassword, password.newPassword);
            await logout(); // Log out after password change
            alert("Password changed successfully");
            navigate("/login");
        } catch (error) {
            console.error("Error changing password:", error);
            alert(error.message || "Failed to change password");
        }
    };


  return (
    <div className="account">
      <SellerMenu />
      <div className="div-2">
        <div className="text-wrapper-8">Change password</div>
        <div className="frame-4">
          <div className="frame-5">
            <form className="form">
              <div className="frame-6">
                <div className="text-wrapper-9">Old Password</div>
                  <input
                      type= {showPassword ? "text" : "password"}
                      name="oldPassword"
                      value={password.oldPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter old password"
                  />
             
              </div>

              <div className="frame-6">
                <div className="text-wrapper-9">New Password</div>
                  <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter new password"
                  />
                 
              </div>
              <div className="frame-6">
                <div className="text-wrapper-9">  Confirm Password</div>
                  <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter new password"
                  />
                  <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} 
                  </button>
              </div>
            </form>
              <button className="button" onClick={handleSubmit}>Save</button>

          </div>
        </div>
      </div>
    </div>
  );
};
export default Account;