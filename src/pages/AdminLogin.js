import React, { useState, useContext } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../helpers/AuthContext";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setAuthState } = useContext(AuthContext);
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
    const data = { username, password };

    axios
      .post("http://52.7.83.229:3001/admin/login", data)
      .then((response) => {
        if (response.data.error) {
          setMessage(response.data.error);
        } else {
          // Lưu token với tên riêng cho admin
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            fullName: response.data.fullName,
            id: response.data.id,
            role: "admin",
            status: true,
          });
          alert("Admin login successful");
          navigate("/AdminDashboard");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setMessage("Admin doesn't exist");
          } else if (error.response.status === 401) {
            setMessage("Incorrect password");
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
            <h1>Admin Log In</h1>
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
                  id="password"
                  name="password"
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

              <button type="submit" className="btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
