import React, { useState, useContext } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from '../helpers/AuthContext'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const {setAuthState} = useContext(AuthContext);
  let navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (message) setMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message) setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { username: username, password: password };
    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          setMessage(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            role: response.data.role,
            status: true,
          });
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
                    <h5 className="alert alert-danger mt-2">{message}</h5>
                  </div>
                )}
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me{" "}
                </label>
                <a href="/">Forgot password?</a>
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
