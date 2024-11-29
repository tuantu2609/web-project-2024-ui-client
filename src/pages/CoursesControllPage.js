import React, { useContext, useEffect, useState } from "react";
import "../Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import axios from "axios";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Import icons from Material-UI
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutIcon from "@mui/icons-material/Logout";

function CoursesControllPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);
  const [deletingVideoId, setDeletingVideoId] = useState(null); // ID video đang được xóa
  const [deletingCourseId, setDeletingCourseId] = useState(null); // ID course đang được xóa

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

  // Fetch courses from API
  const fetchCourses = () => {
    fetch("http://localhost:3001/admin/courses", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data); // Data is already an array
        } else if (typeof data === "object" && data !== null) {
          setCourses([data]); // Wrap single object in an array
        } else {
          setCourses([]); // Default to an empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]); // Handle error gracefully
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Separate courses into pending (draft) and approved (active)
  const pendingCourses = courses.filter((course) => course.status === "draft");
  const approvedCourses = courses.filter(
    (course) => course.status === "active"
  );
  const rejectedCourses = courses.filter(
    (course) => course.status === "rejected"
  );

  // Handle approving a course
  const handleApproveCourse = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/courses/${id}/approve`, {
      method: "PATCH",
      headers: { accessToken },
    })
      .then((response) => {
        if (response.ok) {
          alert("Course approved successfully");
          fetchCourses();
        } else {
          alert("Failed to approve course");
        }
      })
      .catch((error) => console.error("Error approving course:", error));
  };

  // Handle re-approving a rejected course
  const handleReApproveCourse = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/courses/${id}/approve`, {
      method: "PATCH",
      headers: { accessToken },
    })
      .then((response) => {
        if (response.ok) {
          alert("Course approved successfully");
          fetchCourses(); // Refresh the courses list
        } else {
          alert("Failed to approve course");
        }
      })
      .catch((error) => console.error("Error approving course:", error));
  };

  // Handle rejecting a course
  const handleRejectCourse = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/courses/${id}/reject`, {
      // Updated endpoint for reject
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accessToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Course rejected successfully");
          fetchCourses(); // Refresh the courses list to reflect changes
        } else {
          response.json().then((data) => {
            alert(data.error || "Failed to reject course");
          });
        }
      })
      .catch((error) => console.error("Error rejecting course:", error));
  };

  // Handle deleting a course
  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    setDeletingCourseId(id);

    try {
      await axios.delete(`http://localhost:3001/admin/courses/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken") || "",
        },
      });

      alert("Course deleted successfully");
      fetchCourses(); // Refresh the list of courses
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeletingCourseId(null); // Xóa trạng thái xóa
    }
  };

  const filteredCourses = courses
    .filter((course) => course.status === "active") // Only include active courses
    .filter((course) => {
      const instructorName =
        course.Instructor && course.Instructor.UserDetail
          ? course.Instructor.UserDetail.fullName.toLowerCase()
          : "";
      const courseTitle = course.courseTitle?.toLowerCase() || "";

      return (
        courseTitle.includes(search.toLowerCase()) ||
        instructorName.includes(search.toLowerCase())
      );
    });

  const handleViewCourse = (course) => {
    fetch(`http://localhost:3001/admin/courses/${course.id}/details`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        setSelectedCourse(data); // Set the fetched course details
        setCourseVideos(data.videos || []); // Correct property name for videos
        setViewModalVisible(true); // Open the modal
      })
      .catch((error) => console.error("Error fetching course details:", error));
  };

  const handleViewVideo = (video) => {
    window.open(video.url || video.videoURL, "_blank");
  };

  const handleDeleteVideo = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    setDeletingVideoId(videoId); // Đánh dấu video đang được xóa

    try {
      const response = await axios.delete(
        `http://localhost:3001/admin/videos/${videoId}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        alert(response.data.message || "Video deleted successfully");

        // Cập nhật danh sách video
        setCourseVideos((prev) => prev.filter((video) => video.id !== videoId));
      } else {
        alert(response.data.message || "Failed to delete video");
      }
    } catch (error) {
      // Kiểm tra lỗi server trả về
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to delete video");
      } else {
        // Lỗi không liên quan đến server (network, không kết nối được...)
        console.error("Error deleting video:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setDeletingVideoId(null); // Xóa trạng thái xóa
    }
  };

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
            <button className="nav-btn" onClick={() => navigate("/AdminDashboard/VideosControll")}>
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

        {/* Pending Courses */}
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Pending Courses</h3>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Instructor</th>
                <th>Videos</th> {/* New column for video count */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingCourses.length > 0 ? (
                pendingCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td>{course.courseTitle}</td>
                    <td>{course.courseDesc}</td>
                    <td>
                      {course.Instructor && course.Instructor.UserDetail
                        ? course.Instructor.UserDetail.fullName
                        : "N/A"}
                    </td>
                    <td>{course.videoCount || 0}</td> {/* Video count */}
                    <td>
                      <button
                        className="btn btn-info action-btn"
                        onClick={() => handleViewCourse(course)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success action-btn"
                        onClick={() => handleApproveCourse(course.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-warning action-btn"
                        onClick={() => handleRejectCourse(course.id)} // Call the updated reject function
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No pending courses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Approved Courses */}
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Approved Courses</h3>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search approved courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Instructor</th>
                <th>Videos</th>
                <th>Enrollments</th> {/* Add this */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td>{course.courseTitle}</td>
                    <td>{course.courseDesc}</td>
                    <td>{course.Instructor?.UserDetail?.fullName || "N/A"}</td>
                    <td>{course.videoCount || 0}</td>
                    <td>{course.enrollmentCount || 0}</td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleViewCourse(course)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger action-btn ms-3"
                        disabled={deletingCourseId === course.id}
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        {deletingCourseId === course.id ? (
                          <>
                            Deleting...{" "}
                            <span className="spinner-border spinner-border-sm ms-2" />
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No approved courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Rejected Courses */}
        <section className="recentOrders">
          <h3 className="admin__cardHeader">Rejected Courses</h3>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Instructor</th>
                <th>Videos</th> {/* New column for video count */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rejectedCourses.length > 0 ? (
                rejectedCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td>{course.courseTitle}</td>
                    <td>{course.courseDesc}</td>
                    <td>
                      {course.Instructor && course.Instructor.UserDetail
                        ? course.Instructor.UserDetail.fullName
                        : "N/A"}
                    </td>
                    <td>{course.videoCount || 0}</td> {/* Video count */}
                    <td>
                      <button
                        className="btn btn-info action-btn"
                        onClick={() => handleViewCourse(course)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success action-btn"
                        onClick={() => handleReApproveCourse(course.id)}
                      >
                        Approve
                      </button>
                      {/* <button
                        className="btn btn-danger action-btn"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete
                      </button> */}
                      <button
                        className="btn btn-danger action-btn ms-3"
                        disabled={deletingCourseId === course.id}
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        {deletingCourseId === course.id ? (
                          <>
                            Deleting...{" "}
                            <span className="spinner-border spinner-border-sm ms-2" />
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No rejected courses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </section>
      <Modal show={viewModalVisible} onHide={() => setViewModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Course Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <>
              <p>
                <strong>Title:</strong> {selectedCourse.title || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedCourse.description || "N/A"}
              </p>
              <p>
                <strong>Instructor:</strong>{" "}
                {selectedCourse.instructor?.fullName || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedCourse.createdAt
                  ? new Date(selectedCourse.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <hr />
              <h5>Videos:</h5>
              {courseVideos.length > 0 ? (
                <ul>
                  {courseVideos.map((video, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <a
                          href={video.url || video.videoURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {video.title ||
                            video.videoTitle ||
                            `Video ${index + 1}`}
                        </a>
                      </span>
                      <div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewVideo(video)}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deletingVideoId === video.id}
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          {deletingVideoId === video.id ? (
                            <>
                              Deleting...{" "}
                              <span className="spinner-border spinner-border-sm ms-2" />
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No videos available.</p>
              )}
              <hr />
              <h5>Enrollments:</h5>
              {selectedCourse.enrollments?.length > 0 ? (
                <ul>
                  {selectedCourse.enrollments.map((enrollment, index) => (
                    <li key={index}>
                      {enrollment.studentFullName} (Enrolled on:{" "}
                      {new Date(enrollment.enrollDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No enrollments available.</p>
              )}
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

export default CoursesControllPage;
