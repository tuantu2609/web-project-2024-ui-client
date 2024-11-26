import React, { useContext, useEffect, useState } from "react";
import "../Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Import icons from Material-UI
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutIcon from "@mui/icons-material/Logout";

function VideosControll() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [approvedVideos, setApprovedVideos] = useState([]);
  const [rejectedVideos, setRejectedVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  // Fetch videos by status
  const fetchVideosByStatus = (status, setState) => {
    fetch(`http://localhost:3001/admin/pending-videos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.videos)) {
          setState(data.videos.filter((video) => video.status === status));
        } else {
          setState([]);
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => {
        console.error(`Error fetching ${status} videos:`, error);
        setState([]);
      });
  };

  useEffect(() => {
    fetchVideosByStatus("draft", setPendingVideos);
    fetchVideosByStatus("active", setApprovedVideos);
    fetchVideosByStatus("rejected", setRejectedVideos);
  }, []);

  // Handle approving a video
  const handleApproveVideo = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/videos/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer${accessToken}` },
    })
      .then((response) => {
        if (response.ok) {
          alert("Video approved successfully");
          fetchVideosByStatus("draft", setPendingVideos);
          fetchVideosByStatus("active", setApprovedVideos);
        } else {
          alert("Failed to approve video");
        }
      })
      .catch((error) => console.error("Error approving video:", error));
  };

  // Handle rejecting a video
  const handleRejectVideo = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/videos/${id}/reject`, {
      method: "PATCH",
      headers: { Authorization: accessToken },
    })
      .then((response) => {
        if (response.ok) {
          alert("Video rejected successfully");
          fetchVideosByStatus("draft", setPendingVideos);
          fetchVideosByStatus("rejected", setRejectedVideos);
        } else {
          alert("Failed to reject video");
        }
      })
      .catch((error) => console.error("Error rejecting video:", error));
  };

  // Filter approved videos based on search query
  const filteredApprovedVideos = approvedVideos.filter((video) =>
    video.videoTitle.toLowerCase().includes(search.toLowerCase())
  );

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
            <button className="nav-btn">
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
        {/* Pending Videos */}
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Pending Videos</h3>
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
              {pendingVideos.length > 0 ? (
                pendingVideos.map((video, index) => (
                  <tr key={video.id}>
                    <td>{index + 1}</td>
                    <td>{video.videoTitle}</td>
                    <td>{video.videoDesc}</td>
                    <td>{video.videoDuration}</td>
                    <td>
                      <button
                        className="btn btn-success action-btn"
                        onClick={() => handleApproveVideo(video.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-warning action-btn"
                        onClick={() => handleRejectVideo(video.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No pending videos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Approved Videos */}
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Approved Videos</h3>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search approved videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              {filteredApprovedVideos.length > 0 ? (
                filteredApprovedVideos.map((video, index) => (
                  <tr key={video.id}>
                    <td>{index + 1}</td>
                    <td>{video.videoTitle}</td>
                    <td>{video.videoDesc}</td>
                    <td>{video.videoDuration}</td>
                    <td>
                      <button
                        className="btn btn-info action-btn"
                        onClick={() => setSelectedVideo(video)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No approved videos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Rejected Videos */}
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Rejected Videos</h3>
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
              {rejectedVideos.length > 0 ? (
                rejectedVideos.map((video, index) => (
                  <tr key={video.id}>
                    <td>{index + 1}</td>
                    <td>{video.videoTitle}</td>
                    <td>{video.videoDesc}</td>
                    <td>{video.videoDuration}</td>
                    <td>
                      <button
                        className="btn btn-danger action-btn"
                        onClick={() => handleRejectVideo(video.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No rejected videos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </section>

      {/* View Video Modal */}
      <Modal
        show={viewModalVisible}
        onHide={() => setViewModalVisible(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Video Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVideo && (
            <>
              <p>
                <strong>Title:</strong> {selectedVideo.videoTitle}
              </p>
              <p>
                <strong>Description:</strong> {selectedVideo.videoDesc}
              </p>
              <p>
                <strong>Duration:</strong> {selectedVideo.videoDuration}
              </p>
              <p>
                <strong>Status:</strong> {selectedVideo.status}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setViewModalVisible(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VideosControll;
