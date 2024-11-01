import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi
  const [isEmailValid, setIsEmailValid] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  let navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    
    // Check if the entered email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(inputEmail)) {
      setIsEmailValid(true);
      setErrorMessage(""); // Clear error if valid
    } else {
      setIsEmailValid(false);
      setErrorMessage("Invalid email format!"); // Set error message
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  // const handleCheckboxChange = (event) => {
  //   setIsChecked(event.target.checked);
  // };
  

  const handleSubmit = (event) => {
    event.preventDefault();

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có giống nhau không
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!"); // Hiển thị thông báo lỗi
      return;
    }

    if (!isEmailValid) {
      setErrorMessage("Please enter a valid email!");
      return;
    }

    // if (!isChecked) {
    //   setErrorMessage("Please agree to the terms & conditions!");
    //   return;
    // }

    axios
      .post("http://localhost:3001/auth/registration", {
        username: username,
        password: password,
        email: email,
        role: role,
      })
      .then((response) => {
        alert("User created successfully!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("There was an error creating the user!", error);
        alert("Failed to create user. Please try again.");
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
        <div className="regis-wrapper">
          <div className="form-box register">
            <h1>Sign Up</h1>
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
                <label htmlFor="username">Username</label>
              </div>

              <div className="input-box">
                <i className="bx bxs-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <label htmlFor="email">Email</label>
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
                <label htmlFor="pswd">Password</label>
              </div>

              <div className="input-box">
                <i className="bx bx-lock"></i>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <label htmlFor="passwordConfirm">Confirm Password</label>
              </div>

              {errorMessage && ( // Hiển thị thông báo lỗi nếu có
                <div className="error-message">
                  <h5>{errorMessage}</h5>
                </div>
              )}

              <div className="mb-3">
                <label>Role</label>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      value="teacher"
                      id="teacher"
                      onChange={handleRoleChange}
                      checked={role === "teacher"}
                      required
                    />
                    <label className="form-check-label" htmlFor="teacher">
                      Teacher
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      value="student"
                      id="student"
                      onChange={handleRoleChange}
                      checked={role === "student"}
                    />
                    <label className="form-check-label" htmlFor="student">
                      Student
                    </label>
                  </div>
                </div>
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" required /> I agree to the terms &
                  conditions
                </label>
              </div>

              <button type="submit" className="btn">
                Sign Up
              </button>

              <div className="login-register">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="login-link">
                    Log In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
