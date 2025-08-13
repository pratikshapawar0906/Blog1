import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../util";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        const response = await fetch("${process.env.REACT_APP_API_URL}/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        const { success, message, token, user, isNewUser } = data; // Assume backend sends `isNewUser`

        if (success) {
            handleSuccess(message);
            localStorage.setItem("loggedInuser", user.name);
            localStorage.setItem("Token", token);
            localStorage.setItem("userId", user.id);

            setTimeout(() => {
                if (isNewUser) {
                    navigate(`/create-profile/${user.id}`); // Redirect new users to profile creation
                } else {
                    navigate(`/profile/${user.id}`); // Redirect existing users to their profile
                }
            }, 1000);
        } else {
            handleError(message || "Something went wrong!");
        }
        
    } catch (error) {
        handleError(error.message || "An error occurred during login");
        console.error("Error during login:", error);
    }finally {
       setLoading(false);
    }
};



  


  return (
    <>
        <div className="login-container">
          <form className="Form" onSubmit={handleLogin}>
            <div className="form-header">
              <h2>
                <i className="fas fa-user icon"></i> Login
              </h2>
            </div>
    
            <div className="input-container">
              <i className="fas fa-envelope icon"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                className="input"
                onChange={(e) => setEmail(e.target.value)}
                 autoComplete="email"
                required
              />
            </div>
    
            <div className="input-container password-container">
              <i className="fas fa-lock icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                className="input password-input"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"} eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
    
            <button type="submit" className="submit" disabled={!email || !password}>
              Login
            </button>
            <p className="signup-footer">
              Don't have an account? <Link to="/signup">signup</Link>
            </p>
    
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          </form>
          <ToastContainer />
          
        </div>
        {/* <button type="submit" className="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button> */}
    </>
  );
};

export default Login;
