import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginForm() {
  return (
    <div className="container mt-3">
      <form>
        <div className="mb-3 mt-3">
          <label htmlFor="username">User name</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            name="username"
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
