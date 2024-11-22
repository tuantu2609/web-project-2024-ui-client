import React, { useContext, useEffect, useState } from "react";
import "../Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

// Import icons from Material-UI
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutIcon from "@mui/icons-material/Logout";

function AdminDashboard() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      fullName: "",
      id: 0,
      role: "",
      status: false,
    });
    navigate("/tnhh2tv");
  };

  // Gọi API để lấy dữ liệu
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      console.error("Access token is missing!");
      return;
    }

    // Hàm lấy tổng số người dùng
    fetch("http://localhost:3001/auth", {
      headers: {
        accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalUsers(data.length);
      })
      .catch((error) => console.error("Error fetching users:", error));

    // Hàm lấy tổng số khóa học
    fetch("http://localhost:3001/courses", {
      headers: {
        accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalCourses(data.length);
      })
      .catch((error) => console.error("Error fetching courses:", error));

    // Hàm lấy tổng số ghi danh (enrollments)
    fetch("http://localhost:3001/enrollment/all", {
      headers: {
        accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalEnrollments(data.length);
      })
      .catch((error) => console.error("Error fetching enrollments:", error));

    // Hàm lấy tổng số video
    fetch("http://localhost:3001/videos", {
      headers: {
        accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalVideos(data.length);
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, [accessToken]);

  return (
    <div className="container-fluid">
      {/* Sidebar Navigation */}
      <section className="admin__menu-navigation">
        <ul>
          <li className="no-hover">
            <div
              className="nav-header"
              onClick={() => navigate("/AdminDashboard")}
            >
              <span className="icon">
                <i className="fa-solid fa-gem"></i>
              </span>
              <span className="title">T&T Academy Admin</span>
            </div>
          </li>
          <li>
            <button
              className="nav-btn"
              onClick={() => navigate("/AdminDashboard/UsersControll")}
            >
              <span className="icon">
                <AccountCircleIcon />
              </span>
              <span className="title">Users</span>
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("#")}>
              <span className="icon">
                <AutoStoriesIcon />
              </span>
              <span className="title">Courses</span>
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("#")}>
              <span className="icon">
                <GroupIcon />
              </span>
              <span className="title">Enrollments</span>
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("#")}>
              <span className="icon">
                <PlaylistPlayIcon />
              </span>
              <span className="title">Videos</span>
            </button>
          </li>

          <li>
            <button className="nav-btn" onClick={logout}>
              <span className="icon">
                <LogoutIcon />
              </span>
              <span className="title">Sign Out</span>
            </button>
          </li>
        </ul>
      </section>

      {/* Main Content */}
      <section className="admin__menu-main">
        <section className="topbar">
          <div className="admin__menu-topbar">
            <div className="admin__menu-toggle">
              <i className="fa-solid fa-bars"></i>
            </div>
            <div className="admin__menu-user">
              <p className="header__account-name">Admin</p>
              <i className="fa-solid fa-user-tie"></i>
            </div>
          </div>
        </section>

        {/* Overview Cards */}
        <section>
          <div className="admin__cardBox">
            {[
              {
                label: "Total Users",
                value: totalUsers,
                icon: "fa-solid fa-user",
              },
              {
                label: "Total Courses",
                value: totalCourses,
                icon: "fa-solid fa-book-open",
              },
              {
                label: "Total Enrollments",
                value: totalEnrollments,
                icon: "fa-solid fa-user-graduate",
              },
              {
                label: "Total Videos",
                value: totalVideos,
                icon: "fa-solid fa-video",
              },
            ].map(({ label, value, icon }, index) => (
              <div className="admin__card" key={index}>
                <div>
                  <div className="numbers">{value}</div>
                  <div className="cardName">{label}</div>
                </div>
                <div className="iconBx">
                  <i className={icon}></i>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="notifications">
          <h3>Notifications</h3>
          <ul>
            <li>5 New User Signups Today</li>
            <li>2 Courses Awaiting Approval</li>
            <li>Scheduled Maintenance Tomorrow</li>
          </ul>
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-primary">Add New User</button>
            <button className="btn btn-secondary">Create New Course</button>
            <button className="btn btn-success">View Reports</button>
          </div>
        </section>

        {/* User Engagement Section */}
        <section className="engagement">
          <h3>User Engagement</h3>
          <div className="engagement-cards">
            <div className="engagement-card">
              <p>Active Users Today</p>
              <h4>350</h4>
            </div>
            <div className="engagement-card">
              <p>Courses Completed This Week</p>
              <h4>210</h4>
            </div>
          </div>
        </section>

        {/* Upcoming Tasks Section */}
        <section className="upcoming-tasks">
          <h3>Upcoming Tasks</h3>
          <ul>
            <li>Prepare Monthly Report - Due in 3 Days</li>
            <li>Review User Feedback - Due in 5 Days</li>
            <li>Conduct Staff Meeting - Scheduled for Friday</li>
          </ul>
        </section>
      </section>
    </div>
  );
}

export default AdminDashboard;
