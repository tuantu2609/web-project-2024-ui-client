import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Registration = () => {
  const [step, setStep] = useState(1);
  //
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi
  // const [isEmailValid, setIsEmailValid] = useState(false);
  ///
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState({ month: "", day: "", year: "" });

  let navigate = useNavigate();

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   if (password !== confirmPassword) {
  //     setErrorMessage("Passwords do not match!");
  //     return;
  //   }

  //   if (!isEmailValid) {
  //     setErrorMessage("Please enter a valid email!");
  //     return;
  //   }

  //   axios
  //     .post("http://localhost:3001/auth/registration", {
  //       username: username,
  //       password: password,
  //       email: email,
  //       role: role,
  //     })
  //     .then((response) => {
  //       alert("User created successfully!");
  //       navigate("/login");
  //     })
  //     .catch((error) => {
  //       console.error("There was an error creating the user!", error);
  //       alert("Failed to create user. Please try again.");
  //     });
  // };

  const handleNext = (event) => {
    event.preventDefault();
    if (!username || !password || !confirmPassword || !email) {
      setErrorMessage("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");
    setStep(2); // Proceed to personal information step
  };

  const handleBack = () => {
    setStep(1); // Go back to account information step
  };

  const handleSignUp = (event) => {
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
    setErrorMessage("");

    const userData = {
      username: username,
      password: password,
      email: email,
      role: role,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      birthDate: `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
    };
    // console.log(userData);

    axios
      .post("http://localhost:3001/auth/registration", userData)
      .then((response) => {
        alert("User created successfully!");
        navigate("/login");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("Failed to create user. Please try again.");
        }
      });
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
            <h1 style={{ textAlign: "center" }}>Sign Up</h1>
            {step === 1 ? (
              <>
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
                          value="teacher"
                          id="teacher"
                          onChange={(e) => setRole(e.target.value)}
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
                          onChange={(e) => setRole(e.target.value)}
                          checked={role === "student"}
                        />
                        <label className="form-check-label" htmlFor="student">
                          Student
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn">
                    Next Step
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
            ) : (
              <>
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
                    <div className="dropdown me-2">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {birthDate.month || "Month"}
                      </button>
                      <ul className="dropdown-menu scrollable-dropdown">
                        {DateOptions(1, 12, handleMonthChange)}
                      </ul>
                    </div>

                    <div className="dropdown me-2">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {birthDate.day || "Day"}
                      </button>
                      <ul className="dropdown-menu scrollable-dropdown">
                        {DateOptions(
                          1,
                          maxDaysInMonth(
                            birthDate.month,
                            birthDate.year || new Date().getFullYear()
                          ),
                          (value) =>
                            setBirthDate((prevDate) => ({
                              ...prevDate,
                              day: value,
                            }))
                        )}
                      </ul>
                    </div>

                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {birthDate.year || "Year"}
                      </button>
                      <ul className="dropdown-menu scrollable-dropdown">
                        {DateOptions(
                          1900,
                          new Date().getFullYear(),
                          handleYearChange
                        )}
                      </ul>
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
                      onClick={handleBack}
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
                    >
                      Sign Up
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
