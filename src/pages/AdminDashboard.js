import React, { useContext } from "react";
import "../Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

// Import icons from Material-UI
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import LogoutIcon from "@mui/icons-material/Logout";

function AdminDashboard() {
  const { authState, setAuthState } = useContext(AuthContext);
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

  return (
    <div className="container-fluid">
      {/* Sidebar Navigation */}
      <section className="admin__menu-navigation">
        <ul>
          <li className="no-hover">
            <div className="nav-header">
              <span className="icon">
                <i className="fa-solid fa-gem"></i>
              </span>
              <span className="title">T&T Academy Admin</span>
            </div>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("#")}>
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
            <button className="nav-btn" onClick={() => navigate("#")}>
              <span className="icon">
                <SettingsApplicationsIcon />
              </span>
              <span className="title">Settings</span>
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
              { label: "Total Users", value: "2,345", icon: "fa-solid fa-user" },
              { label: "Total Courses", value: "123", icon: "fa-solid fa-book-open" },
              { label: "Total Enrollments", value: "3,456", icon: "fa-solid fa-user-graduate" },
              { label: "Total Videos", value: "876", icon: "fa-solid fa-video" },
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
