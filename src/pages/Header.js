import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

// Import icons from Material-UI
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";
// import SearchIcon from "@mui/icons-material/Search";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { authState, setAuthState } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in
  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      fullName: "",
      id: 0,
      role: "",
      status: false,
    });
    setIsLoggedIn(false); // Update isLoggedIn state
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change 50 to your preferred scroll threshold
    };

    window.addEventListener("scroll", handleScroll);

    // Check for token on mount
    const token = localStorage.getItem("accessToken");
    if (token) {
      // If token exists, set isLoggedIn to true
      setIsLoggedIn(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`header-section fixed-top ${isScrolled ? "scrolled" : ""}`}>
      <nav className="navbar navbar-expand-lg">
        {/* Logo */}
        <a className="navbar-brand ms-2 d-flex align-items-center" href="/">
          <img
            src="http://localhost:3000/logo.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          <span className="navbar-text ms-2">From Zero to Hero</span>
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
          {/* <span className="navbar-text me-auto">From Zero to Hero</span> */}

          <form className="d-flex flex-grow-1 my-2 my-lg-0" role="search">
            <input
              className="form-control me-1"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />

            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>

          {/* Conditional Rendering based on login status */}
          <div className="d-flex justify-content-end">
            {isLoggedIn ? (
              <>
                {/* Teacher Upload Video */}
                {authState.role === "teacher" && (
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn ms-2"
                      onClick={() => navigate("/upload-courses")}
                    >
                      <SchoolIcon />
                    </button>
                    <button
                      type="button"
                      className="btn ms-2"
                      onClick={() => navigate("/upload-video")}
                    >
                      <VideoCallIcon />
                    </button>
                  </div>
                )}

                {/* Notifications */}
                <button
                  type="button"
                  className="btn me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#notificationModal"
                >
                  <NotificationsIcon />
                </button>

                {/* Notification Modal */}
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

                {/* Profile Dropdown */}
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
                        onClick={() => navigate(`/user/${authState.id}`)}
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
                      <button className="dropdown-item" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Sign Up and Log In buttons */}
                <button
                  className="btn btn-primary me-1 ms-1"
                  onClick={() => navigate(`/registration`)}
                >
                  Sign Up
                </button>
                <button
                  className="btn btn-secondary me-1"
                  onClick={() => navigate(`/login`)}
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
