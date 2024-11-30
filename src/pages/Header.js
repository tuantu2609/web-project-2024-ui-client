import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Tooltip } from "bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]); // Thêm trạng thái cho thông báo
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Quản lý modal thông báo
  const { authState, setAuthState } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }, []);

  useEffect(() => {
    setIsNavbarOpen(false);
  }, [location]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    axios
      .get(`http://localhost:3001/search?query=${query}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      });
  };

  const handleResultClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Notification functions
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3001/notifications", {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      });
      setNotifications(response.data);

      // Cập nhật số lượng thông báo chưa đọc
      const unreadCount = response.data.filter(
        (notification) => notification.status === "unread"
      ).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([
        { id: 1, message: "Unable to fetch notifications. Try again later." },
      ]);
    }
  };

  useEffect(() => {
    // Gọi API để lấy thông báo khi tải trang
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const targetNotification = notifications.find(
        (notification) => notification.id === notificationId
      );

      // Chỉ xử lý nếu thông báo đang ở trạng thái "unread"
      if (targetNotification?.status === "unread") {
        await axios.patch(
          `http://localhost:3001/notifications/${notificationId}/read`,
          {},
          {
            headers: {
              accessToken: localStorage.getItem("accessToken") || "",
            },
          }
        );

        // Cập nhật trạng thái thông báo và số lượng chưa đọc
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: "read" }
              : notification
          )
        );

        setUnreadCount((prev) => prev - 1); // Chỉ giảm số lượng khi trạng thái là "unread"
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:3001/notifications/${notificationId}`,
        {
          headers: {
            accessToken: localStorage.getItem("accessToken") || "",
          },
        }
      );

      // Loại bỏ thông báo khỏi danh sách
      setNotifications((prev) => {
        const updatedNotifications = prev.filter(
          (notification) => notification.id !== notificationId
        );

        // Cập nhật số lượng thông báo chưa đọc
        const updatedUnreadCount = updatedNotifications.filter(
          (notification) => notification.status === "unread"
        ).length;
        setUnreadCount(updatedUnreadCount);

        return updatedNotifications;
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) {
      return;
    }

    try {
      await axios.delete("http://localhost:3001/notifications", {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      });

      // Xóa toàn bộ thông báo khỏi danh sách và cập nhật số lượng chưa đọc
      setNotifications([]);
      setUnreadCount(0); // Đặt số lượng chưa đọc về 0
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  return (
    <div className={`header-section fixed-top ${isScrolled ? "scrolled" : ""}`}>
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand ms-2 d-flex align-items-center" href="/">
          <img
            src="/logo.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          <span className="navbar-text ms-2">From Zero to Hero</span>
        </a>

        <button
          className={`navbar-toggler ${isNavbarOpen ? "" : "collapsed"}`}
          type="button"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          aria-controls="navbarSupportedContent"
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${
            isNavbarOpen ? "show" : ""
          } justify-content-between`}
          id="navbarSupportedContent"
        >
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

          <div className="d-flex justify-content-end">
            {isLoggedIn ? (
              <>
                {authState.role === "instructor" && (
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn ms-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Manage Course"
                      onClick={() => navigate("/manage-courses")}
                    >
                      <SchoolIcon />
                    </button>
                    <button
                      type="button"
                      className="btn ms-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Manage Video"
                      onClick={() => navigate("/manage-videos")}
                    >
                      <VideoCallIcon />
                    </button>
                  </div>
                )}

                {/* Notifications */}
                {/* <button
                  type="button"
                  className="btn me-2"
                  onClick={handleNotificationClick}
                >
                  <NotificationsIcon />
                </button> */}
                <button
                  type="button"
                  className="btn position-relative me-2"
                  onClick={handleNotificationClick}
                >
                  <NotificationsIcon />
                  {unreadCount > 0 && (
                    <span
                      className="position-absolute top-50 start-80 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.75rem", padding: "0.3em 0.6em" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="dropdown d-flex align-items-center">
                  <span className="me-2" style={{ fontWeight: "bold" }}>
                    {authState.fullName}
                  </span>
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <AccountCircleIcon />
                  </button>
                  {isDropdownOpen && (
                    <ul
                      className="dropdown-menu dropdown-menu-end show"
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        zIndex: 1050,
                      }}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate(`/user/${authState.id}`);
                          }}
                        >
                          Profile
                        </button>
                      </li>
                      {/* <li>
                        <button
                          className="dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Courses
                        </button>
                      </li> */}
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Purchases
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Setting
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
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

      {/* Notification Modal */}
      {isNotificationOpen && (
        <div
          className="modal fade show"
          tabIndex="-1"
          aria-labelledby="notificationModalLabel"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleNotificationClose}
        >
          <div
            className="modal-dialog modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="notificationModalLabel">
                  Notifications
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleNotificationClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {notifications.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="list-group-item d-flex justify-content-between"
                      >
                        <span
                          className={`notification-message ${
                            notification.status === "unread" ? "fw-bold" : ""
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {notification.message}
                        </span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          <CloseIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No notifications available.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAllNotifications}
                >
                  Delete All
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleNotificationClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
