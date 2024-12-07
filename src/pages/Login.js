import React, { useState, useContext, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthContext } from "../helpers/AuthContext";
import CryptoJS from "crypto-js";

const secretKey = "your-secret-key";

// Hàm mã hóa
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Hàm giải mã
const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const { API_URL } = useContext(AuthContext);

  let navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (message) setMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message) setMessage("");
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { username: username, password: password };
    axios
      .post(`${API_URL}/auth/login`, data)
      .then((response) => {
        if (response.data.error) {
          setMessage(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            fullName: response.data.fullName,
            id: response.data.id,
            role: response.data.role,
            status: true,
          });

          if (rememberMe) {
            // Mã hóa trước khi lưu
            localStorage.setItem("rememberedUsername", encryptData(username));
            localStorage.setItem("rememberedPassword", encryptData(password));
          } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
          }

          alert("Login successful");
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setMessage("User Doesn't Exist");
          } else if (error.response.status === 401) {
            setMessage("Wrong Username And Password Combination");
          } else {
            setMessage("Internal server error.");
          }
        } else {
          setMessage("Error: Unable to connect to the server.");
        }
      });
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedUsername && storedPassword) {
      // Giải mã khi lấy ra
      setUsername(decryptData(storedUsername));
      setPassword(decryptData(storedPassword));
      setRememberMe(true);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "url('background.jpg') no-repeat center center/cover",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="log-wrapper">
          <div className="form-box login">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <i className="bx bxs-user-circle"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
                <label>Username</label>
              </div>

              <div className="input-box">
                <i className="bx bx-lock"></i>
                <input
                  type="password"
                  id="pswd"
                  name="pswd"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <label>Password</label>
                {message && (
                  <div className="error-message">
                    <h5
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {message}{" "}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setMessage("")}
                      ></button>
                    </h5>
                  </div>
                )}
              </div>

              <div className="remember-forgot">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />{" "}
                  Remember me{" "}
                </label>
                <a href="/forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="btn">
                Login
              </button>

              <div className="login-register">
                <p>
                  Don't have an account?{" "}
                  <a href="/registration" className="register-link">
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
