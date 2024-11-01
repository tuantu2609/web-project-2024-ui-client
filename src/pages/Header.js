import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";

// Import icons from Material-UI

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Header() {
  let navigate = useNavigate();

  return (
    <div className="header-section fixed-top">
      <nav className="navbar navbar-expand-lg">
        {/* Logo */}
        <a className="navbar-brand ms-2" href="/">
          <img
            src="http://localhost:3000/logo.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
        </a>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent"
        >
          <span className="navbar-text me-auto">HTML CSS từ Zero đến Hero</span>

          <form className="d-flex my-2 my-lg-0" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>

          {/* Notification */}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn me-2"
              data-bs-toggle="modal"
              data-bs-target="#notificationModal"
            >
              <NotificationsIcon />
            </button>

            <div
              className="modal fade"
              id="notificationModal"
              tabIndex="-1"
              aria-hidden="true"
              aria-labelledby="notificationModalLabel"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
            >
              <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="notificationModalLabel">
                      Notifications
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">Notification 1</li>
                      <li className="list-group-item">Notification 2</li>
                      <li className="list-group-item">Notification 3</li>
                      <li className="list-group-item">Notification 4</li>
                      <li className="list-group-item">Notification 5</li>
                    </ul>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="dropdown">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <AccountCircleIcon />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate(`/user/1`)}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item">My Courses</button>
                </li>
                <li>
                  <button className="dropdown-item">My Purchases</button>
                </li>
                <li>
                  <button className="dropdown-item">Setting</button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate(`/login`)}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
