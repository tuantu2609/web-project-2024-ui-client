import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

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

  const handleSubmit = (event) => {  
    event.preventDefault();
    axios.post("http://localhost:3001/users/", {
      username: username,
      password: password,
      role: role,
    })
    .then((response) => {
      alert("User created successfully!");
      navigate("/"); 
    })
    .catch((error) => {
      console.error("There was an error creating the user!", error);
      alert("Failed to create user. Please try again.");
    });
  };


  return (
    <div className="container mt-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-3">
          <label htmlFor="username">User name</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pwd">Password</label>
          <input
            type="password"
            className="form-control"
            id="pwd"
            placeholder="Enter password"
            name="pswd"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
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
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
