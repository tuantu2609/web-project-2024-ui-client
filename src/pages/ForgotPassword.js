import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PendingIcon from "@mui/icons-material/Pending";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Quản lý các bước
  const [email, setEmail] = useState(""); // Email người dùng
  const [verificationCode, setVerificationCode] = useState(""); // Mã xác minh
  const [password, setPassword] = useState(""); // Mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(""); // Xác nhận mật khẩu
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  // Bước 1: Gửi mã xác minh đến email
  const handleSendCode = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://52.7.83.229:3001/auth/send-reset-code", { email });
      alert("Verification code sent to your email.");
      setStep(2); // Chuyển sang bước nhập mã
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to send verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: Xác minh mã
  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://52.7.83.229:3001/auth/verify-reset-code", {
        email,
        code: verificationCode,
      });
      alert("Verification successful!");
      setStep(3); // Chuyển sang bước đặt lại mật khẩu
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to verify the code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://52.7.83.229:3001/auth/reset-password", {
        email,
        password,
      });
      alert("Password reset successful!");
      navigate("/login"); // Điều hướng đến trang đăng nhập
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to reset password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm quản lý nhập mã xác minh
  const handleCodeInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const updatedCode = verificationCode.split("");

    if (value) {
      updatedCode[index] = value;
      setVerificationCode(updatedCode.join(""));

      if (index < 4) {
        const nextInput = document.querySelectorAll(".code-input")[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const updatedCode = verificationCode.split("");
      if (updatedCode[index]) {
        updatedCode[index] = "";
        setVerificationCode(updatedCode.join(""));
      } else if (index > 0) {
        updatedCode[index - 1] = "";
        setVerificationCode(updatedCode.join(""));
        const prevInput = document.querySelectorAll(".code-input")[index - 1];
        if (prevInput) prevInput.focus();
      }
    }
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
            {step === 1 && (
              <>
                <h1>Forgot Password</h1>
                <form onSubmit={handleSendCode}>
                  <div className="input-box">
                    <i className="bx bxs-envelope"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  {errorMessage && (
                    <div className="error-message">
                      <h5>{errorMessage}</h5>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="btn btn-secondary"
                      style={{
                        width: "30%",
                      }}
                    >
                      <ArrowBackIcon /> Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        width: "30%",
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? <PendingIcon /> : "Next Step"}
                    </button>
                  </div>
                </form>
              </>
            )}
            {step === 2 && (
              <>
                <form onSubmit={handleVerifyCode}>
                  <h2>Check your email</h2>
                  <p>
                    Enter the 5-digit verification code sent to{" "}
                    <strong>{email}</strong>.
                  </p>
                  <div className="code-inputs">
                    {[...Array(5)].map((_, index) => (
                      <input
                        type="text"
                        maxLength="1"
                        className="form-control code-input"
                        value={verificationCode[index] || ""}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onChange={(e) => handleCodeInput(e, index)}
                        key={index}
                        required
                      />
                    ))}
                  </div>
                  {errorMessage && (
                    <div className="error-message">
                      <h5>{errorMessage}</h5>
                    </div>
                  )}
                  <div className="button-container">
                    <button
                      type="submit"
                      className="btn verify-button"
                      disabled={isLoading}
                    >
                      {isLoading ? <PendingIcon /> : "Verify Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn back-button"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </>
            )}
            {step === 3 && (
              <>
                <h1>Reset Password</h1>
                <form onSubmit={handleResetPassword}>
                  <div className="input-box">
                    <i className="bx bx-lock"></i>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="password">New Password</label>
                  </div>
                  <div className="input-box">
                    <i className="bx bx-lock"></i>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                  </div>
                  {errorMessage && (
                    <div className="error-message">
                      <h5>{errorMessage}</h5>
                    </div>
                  )}
                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? <PendingIcon /> : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
