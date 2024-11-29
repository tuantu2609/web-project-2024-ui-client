import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import "../Admin.css";
import Button from "react-bootstrap/Button";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutIcon from "@mui/icons-material/Logout";

function VideosControllPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [videos, setVideos] = useState([]); // State for storing videos
  const [search, setSearch] = useState(""); // State for search query
  const [deletingVideoId, setDeletingVideoId] = useState(null); // State for deleting status
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

  // Fetch videos from the API
  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/videos", {
        headers: { accessToken: localStorage.getItem("accessToken") || "" },
      });
      setVideos(response.data); // Store fetched videos in state
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Handle deleting a video
  const handleDeleteVideo = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    setDeletingVideoId(videoId); // Set the ID of the video being deleted

    try {
      const response = await axios.delete(
        `http://localhost:3001/admin/videos/${videoId}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") || "" },
        }
      );
      alert(response.data.message || "Video deleted successfully");

      // Remove deleted video from the list
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoId)
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete the video.");
    } finally {
      setDeletingVideoId(null); // Reset the deleting status
    }
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter(
    (video) =>
      video.videoTitle.toLowerCase().includes(search.toLowerCase()) ||
      video.videoDesc.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchVideos(); // Fetch videos on component mount
  }, []);

  return (
    <div className="container-fluid">
      {/* Sidebar Navigation */}
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
            <button
              className="nav-btn"
              onClick={() => navigate("/AdminDashboard/CoursesControll")}
            >
              <span className="icon">
                <AutoStoriesIcon />
              </span>
              <span className="title">Courses</span>
            </button>
          </li>

          <li>
            <button
              className="nav-btn"
              onClick={() => navigate("/AdminDashboard/VideosControll")}
            >
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
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Manage Videos</h3>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video, index) => (
                  <tr key={video.id}>
                    <td>{index + 1}</td>
                    <td>{video.videoTitle}</td>
                    <td>{video.videoDesc}</td>
                    <td>{video.videoDuration || "N/A"}</td>
                    <td>
                      <Button
                        variant="primary"
                        className="me-2"
                        onClick={() => window.open(video.videoURL, "_blank")} // Open video in a new tab
                      >
                        View
                      </Button>
                      <Button
                        variant="danger"
                        disabled={deletingVideoId === video.id}
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        {deletingVideoId === video.id ? (
                          <>
                            Deleting...
                            <span className="spinner-border spinner-border-sm ms-2" />
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No videos found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </section>
    </div>
  );
}

export default VideosControllPage;
