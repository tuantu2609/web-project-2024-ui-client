import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      fullName: "",
      id: 0,
      role: "",
      status: false,
    });
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (!query.trim()) {
      setSearchResults([]); // Clear results if query is empty
      return;
    }
  
    axios
      .get(`http://localhost:3001/search?query=${query}`, { // Updated to /search
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      })
      .then((response) => {
        setSearchResults(response.data); // Store search results in state
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setSearchResults([]); // Clear results if there’s an error
      });
  };
  
  
  
  

  const handleResultClick = (courseId) => {
    navigate(`/courses/${courseId}`); // Navigate to the course page
    setSearchQuery(""); // Clear search query
    setSearchResults([]); // Clear search results
  };
  

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
          {/* Search Bar */}
          <div className="search-bar position-relative flex-grow-1">
            <input
              className="form-control me-1"
              type="search"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <div className="search-results dropdown-menu show">
                {searchResults.map((course) => (
                  <button
                    key={course.id}
                    className="dropdown-item"
                    onClick={() => handleResultClick(course.id)}
                  >
                    {course.courseTitle}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conditional Rendering based on login status */}
          <div className="d-flex justify-content-end">
            {isLoggedIn ? (
              <>
                {/* Instructor Upload Video */}
                {authState.role === "instructor" && (
                  <div className="d-flex align-items-center">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="btn ms-2 dropdown-toggle"
                        id="courseActionsDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <SchoolIcon />
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="courseActionsDropdown"
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/upload-courses")}
                          >
                            Upload Course
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/manage-courses")}
                          >
                            Manage Course
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="dropdown">
                      <button
                        type="button"
                        className="btn ms-2 dropdown-toggle"
                        id="videoActionsDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <VideoCallIcon  />
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="videoActionsDropdown"
                      >
                        <li>
                          {/* <button
                            className="dropdown-item"
                            onClick={() => navigate("/upload-courses")}
                          >
                            Upload Course
                          </button> */}
                                              <button
                      className="dropdown-item"
                      onClick={() => navigate("/upload-video")}
                    >
                      Upload Video
                    </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/manage-videos")}
                          >
                            Manage Video
                          </button>
                        </li>
                      </ul>
                    </div>
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
                <div className="dropdown d-flex align-items-center">
                  <span className="me-2" style={{ fontWeight: "bold" }}>
                    {authState.fullName}
                  </span>
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
