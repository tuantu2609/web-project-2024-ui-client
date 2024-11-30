import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PendingIcon from "@mui/icons-material/Pending";

const Registration = () => {
  const [step, setStep] = useState(1);
  //
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState({ month: "", day: "", year: "" });
  const [isMonthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setDayDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const handleNext = async (event) => {
    event.preventDefault();

    // Kiểm tra các trường hợp thiếu dữ liệu hoặc mật khẩu không khớp
    if (!username || !password || !confirmPassword || !email) {
      setErrorMessage("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Bật trạng thái loading
    setErrorMessage("");

    try {
      // Bước 1: Kiểm tra trùng lặp username hoặc email
      const checkResponse = await axios.post(
        "http://localhost:3001/auth/check-duplicate",
        {
          username,
          email,
        }
      );

      if (checkResponse.status === 200) {
        await axios.post("http://localhost:3001/auth/send-email", {
          email,
        });

        alert("Verification code sent to your email.");
        setStep(2); // Chuyển sang bước 2
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Lỗi từ server (email/username trùng)
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleCodeInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Chỉ cho phép số
    const updatedCode = verificationCode.split("");

    if (value) {
      updatedCode[index] = value; // Cập nhật giá trị tại ô hiện tại
      setVerificationCode(updatedCode.join("")); // Cập nhật state

      // Chuyển focus sang ô tiếp theo nếu không phải ô cuối
      if (index < 4) {
        const nextInput = document.querySelectorAll(".code-input")[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Ngăn hành vi mặc định của phím Backspace

      // Chuyển verificationCode thành mảng để thao tác
      const updatedCode = verificationCode.split("");

      if (updatedCode[index]) {
        // Nếu ô hiện tại có ký tự, xóa ký tự tại ô đó
        updatedCode[index] = "";
        setVerificationCode(updatedCode.join("")); // Cập nhật state
      } else if (index > 0) {
        // Nếu ô hiện tại trống, chuyển focus về ô trước đó và xóa ký tự tại đó
        updatedCode[index - 1] = "";
        setVerificationCode(updatedCode.join(""));

        // Di chuyển focus về ô trước
        const prevInput = document.querySelectorAll(".code-input")[index - 1];
        if (prevInput) prevInput.focus();
      }
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("http://localhost:3001/auth/verify-code", {
        email,
        code: verificationCode,
      });
      alert("Verification successful!");
      setErrorMessage("");
      setStep(3);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !birthDate.month ||
      !birthDate.day ||
      !birthDate.year
    ) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setIsLoading(true); // Bật loading
    setErrorMessage("");

    const userData = {
      username,
      password,
      email,
      role,
      firstName,
      lastName,
      phone,
      birthDate: `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
    };

    try {
      await axios.post("http://localhost:3001/auth/registration", userData);
      alert("User created successfully!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to create user. Please try again.");
      }
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const DateOptions = (start, end, onSelect) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(
        <li key={i}>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => onSelect(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return options;
  };

  const maxDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const handleMonthChange = (month) => {
    setBirthDate((prevDate) => {
      const maxDay = maxDaysInMonth(
        month,
        prevDate.year || new Date().getFullYear()
      );
      return {
        ...prevDate,
        month,
        day: prevDate.day > maxDay ? maxDay : prevDate.day, // Điều chỉnh ngày nếu vượt quá giới hạn
      };
    });
    setErrorMessage("");
    setMonthDropdownOpen(false); // Đóng dropdown
  };

  const handleYearChange = (year) => {
    setBirthDate((prevDate) => {
      const maxDay = maxDaysInMonth(prevDate.month || 1, year); // Giới hạn số ngày trong tháng và năm mới
      return {
        ...prevDate,
        year,
        day: prevDate.day > maxDay ? maxDay : prevDate.day, // Điều chỉnh ngày nếu vượt quá giới hạn
      };
    });
    setYearDropdownOpen(false);
    setErrorMessage("");
  };

  const handleDayChange = (day) => {
    setBirthDate((prevDate) => ({
      ...prevDate,
      day,
    }));
    setDayDropdownOpen(false); // Đóng dropdown sau khi chọn
    setErrorMessage("");
  };

  const toggleMonthDropdown = (e) => {
    e.preventDefault(); // Ngăn form submit
    setMonthDropdownOpen(!isMonthDropdownOpen);
    setDayDropdownOpen(false);
    setYearDropdownOpen(false);
  };

  const toggleDayDropdown = (e) => {
    e.preventDefault(); // Ngăn form submit
    setDayDropdownOpen(!isDayDropdownOpen);
    setMonthDropdownOpen(false);
    setYearDropdownOpen(false);
  };

  const toggleYearDropdown = (e) => {
    e.preventDefault(); // Ngăn form submit
    setYearDropdownOpen(!isYearDropdownOpen);
    setMonthDropdownOpen(false);
    setDayDropdownOpen(false);
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
            {step === 1 && (
              <>
                <h1>Sign Up</h1>
                <form onSubmit={handleNext}>
                  <div className="input-box">
                    <i className="bx bxs-user-circle"></i>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <div className="d-flex">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          value="instructor"
                          id="instructor"
                          onChange={(e) => setRole(e.target.value)}
                          checked={role === "instructor"}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="instructor"
                        >
                          Instructor
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          value="student"
                          id="student"
                          onChange={(e) => setRole(e.target.value)}
                          checked={role === "student"}
                        />
                        <label className="form-check-label" htmlFor="student">
                          Student
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? <PendingIcon /> : "Next Step"}
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
              </>
            )}
            {step === 2 && (
              <>
                <form onSubmit={handleVerifyCode}>
                  <h2 className="form-title">Check your email</h2>
                  <p>
                    We sent a reset link to <strong>{email}</strong>. Enter the
                    5-digit code from the email.
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
                      onClick={() => setStep(1)} // Quay lại bước trước đó
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
                <h1>Personal Information</h1>
                <form onSubmit={handleSignUp}>
                  <div className="input-box">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <label htmlFor="firstName">First Name</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <label htmlFor="lastName">Last Name</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="me-5">Birth Day</span>
                    {/* Dropdown chọn tháng */}
                    <div className="date-choose me-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleMonthDropdown}
                      >
                        {birthDate.month || "Month"}
                      </button>
                      {isMonthDropdownOpen && (
                        <ul className="custom-dropdown">
                          {DateOptions(1, 12, handleMonthChange)}
                        </ul>
                      )}
                    </div>

                    {/* Dropdown chọn ngày */}
                    <div className="date-choose me-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleDayDropdown}
                      >
                        {birthDate.day || "Day"}
                      </button>
                      {isDayDropdownOpen && (
                        <ul className="custom-dropdown">
                          {DateOptions(
                            1,
                            maxDaysInMonth(
                              birthDate.month || 1,
                              birthDate.year || new Date().getFullYear()
                            ),
                            handleDayChange
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Dropdown chọn năm */}
                    <div className="date-choose me-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleYearDropdown}
                      >
                        {birthDate.year || "Year"}
                      </button>
                      {isYearDropdownOpen && (
                        <ul className="custom-dropdown">
                          {DateOptions(
                            1900,
                            new Date().getFullYear(),
                            handleYearChange
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="remember-forgot mt-5">
                    <label>
                      <input type="checkbox" required /> I agree to the terms &
                      conditions
                    </label>
                  </div>
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn"
                      style={{
                        width: "30%",
                      }}
                    >
                      <ArrowBackIcon />
                    </button>
                    <button
                      type="submit"
                      className="btn"
                      style={{
                        width: "30%",
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? <PendingIcon /> : "Sign Up"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
