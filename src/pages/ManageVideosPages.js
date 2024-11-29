import React, { useEffect, useState, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Footer from "./Footer";

import axios from "axios";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LoopIcon from "@mui/icons-material/Loop";
import UploadIcon from "@mui/icons-material/Upload";

function ManageVideoPages() {
  const { authState } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [initialVideoState, setInitialVideoState] = useState(null); // Store initial video state
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else if (authState?.role === "instructor") {
      axios
        .get("http://localhost:3001/courses/instructor", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => console.error("Error fetching courses:", error));
    }
  }, [navigate, authState.role]);

  const fetchVideosByCourse = (courseId) => {
    axios
      .get(`http://localhost:3001/courseVideo/course-le/${courseId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        const fetchedVideos = response.data.map((courseVideo) => ({
          ...courseVideo.Video, // Spread the nested Video object
          id: courseVideo.id, // Include the outer id field
        }));
        setVideos(fetchedVideos);
        setSelectedVideo(null); // Clear selected video
        setTitle("");
        setDescription("");
        setVideoPreview(null);
        setInitialVideoState(null); // Clear initial state
      })
      .catch((error) => console.error("Error fetching videos:", error));
  };

  useEffect(() => {
    const waitForHeaderAndSetMargin = () => {
      const header = document.querySelector(".header-section");
      const bodySection = document.querySelector(".body-section");

      if (header && bodySection) {
        setBodySectionMarginTop();
      } else {
        // Nếu chưa tồn tại header, thử lại sau 100ms
        setTimeout(waitForHeaderAndSetMargin, 100);
      }
    };

    waitForHeaderAndSetMargin(); // Gọi hàm khi effect chạy
  }, []);

  // useEffect(() => {
  //   const waitForHeaderAndSetMargin = () => {
  //     const header = document.querySelector(".header-section");
  //     const bodySection = document.querySelector(".body-section");

  //     if (header && bodySection) {
  //       // Đảm bảo margin được thiết lập khi header đã hoàn thành chuyển động
  //       const handleTransitionEnd = () => {
  //         setBodySectionMarginTop(); // Cập nhật margin sau khi header thu nhỏ
  //         header.removeEventListener("transitionend", handleTransitionEnd); // Xóa sự kiện lắng nghe
  //       };

  //       // Lắng nghe sự kiện transitionend
  //       header.addEventListener("transitionend", handleTransitionEnd);

  //       // Gọi ngay margin nếu không có chuyển động (ví dụ khi load trang mới)
  //       if (
  //         !getComputedStyle(header).transition ||
  //         getComputedStyle(header).transition === "none"
  //       ) {
  //         setBodySectionMarginTop();
  //         header.removeEventListener("transitionend", handleTransitionEnd);
  //       }
  //     } else {
  //       // Nếu chưa tồn tại header hoặc bodySection, thử lại sau 100ms
  //       setTimeout(waitForHeaderAndSetMargin, 100);
  //     }
  //   };

  //   waitForHeaderAndSetMargin(); // Gọi hàm khi effect chạy

  //   return () => {
  //     const header = document.querySelector(".header-section");
  //     if (header) {
  //       header.removeEventListener("transitionend", waitForHeaderAndSetMargin);
  //     }
  //   };
  // }, []);

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    fetchVideosByCourse(courseId);
  };

  const handleVideoSelect = (video) => {
    console.log("Selected video data:", video);

    setSelectedVideo(video);
    setTitle(video.videoTitle);
    setDescription(video.videoDesc);
    setVideoPreview(video.videoURL);

    // Save initial state
    setInitialVideoState({
      title: video.videoTitle,
      description: video.videoDesc,
      videoPreview: video.videoURL,
    });

    setIsEditing(false); // Disable editing by default
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (initialVideoState) {
      setTitle(initialVideoState.title);
      setDescription(initialVideoState.description);
      setVideoPreview(initialVideoState.videoPreview);
    }
    setVideoFile(null); // Clear any uploaded file
    setIsEditing(false);
  };

  const handleChangeVideo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file)); // Show a preview of the selected video
    }
  };

  const handleUpdateVideo = async () => {
    if (!selectedVideo) return;

    setIsUploading(true);

    try {
      if (videoFile) {
        // Nếu có file mới, sử dụng FormData
        const formData = new FormData();
        formData.append("videoTitle", title);
        formData.append("videoDesc", description);
        formData.append("video", videoFile);

        await axios.put(
          `http://localhost:3001/videos/${selectedVideo.id}`,
          formData,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Nếu không có file mới, gửi JSON
        await axios.put(
          `http://localhost:3001/videos/${selectedVideo.id}`,
          {
            videoTitle: title,
            videoDesc: description,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          }
        );
      }

      setAlertMessage("Video updated successfully!");
      setAlertType("success");
      fetchVideosByCourse(selectedCourse); // Refresh video list
      setIsEditing(false);
    } catch (error) {
      setAlertMessage("Failed to update video.");
      setAlertType("danger");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;

    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:3001/videos/${selectedVideo.id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      setAlertMessage("Video deleted successfully!");
      setAlertType("success");
      fetchVideosByCourse(selectedCourse); // Refresh video list
      setSelectedVideo(null);
      setTitle("");
      setDescription("");
      setVideoPreview(null);
    } catch (error) {
      setAlertMessage("Failed to delete video.");
      setAlertType("danger");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="UploadPages-background">
      <div className="body-section">
        {/* Buttons */}
        <div className="position-relative d-flex align-items-center w-100">
          {/* Dropdown cho màn hình nhỏ */}
          <div className="dropdown d-md-none ms-3 me-3 mt-3 mb-3">
            <button
              className="btn btn-outline-primary me-3"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosNewIcon /> Back
            </button>

            {!selectedVideo && (
              <button
                className="btn btn-info me-3"
                onClick={() => navigate("/upload-video")}
              >
                <UploadIcon /> Upload Video
              </button>
            )}

            {selectedVideo && (
              <>
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  onClick={toggleDropdown}
                >
                  Functions
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-end show">
                    <button
                      className="dropdown-item"
                      onClick={handleStartEditing}
                      disabled={isEditing}
                    >
                      Update Video
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleDeleteVideo}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <LoopIcon /> : "Delete Video"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Nút cho màn hình lớn */}
          <div className="d-none d-md-flex align-items-center">
            <button
              className="btn btn-outline-primary ms-3 me-3 mt-3 mb-3"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosNewIcon /> Back
            </button>
            {!selectedVideo && (
              <button
                className="btn btn-info me-3"
                onClick={() => navigate("/upload-video")}
                disabled={isEditing}
              >
                <UploadIcon /> Upload Video
              </button>
            )}
            {selectedVideo && (
              <div className="position-absolute" style={{ right: "0" }}>
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleUpdateVideo}
                      disabled={isUploading}
                    >
                      {isUploading ? <LoopIcon /> : "Save Changes"}
                    </button>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={handleChangeVideo}
                      disabled={isUploading}
                    >
                      <UploadFileIcon /> Change Video
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleCancel}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      onClick={handleStartEditing}
                      disabled={isUploading}
                    >
                      Update Video
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteVideo}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <LoopIcon /> : "Delete Video"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hidden input for file upload */}
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleVideoUpload}
        />

        {alertMessage && (
          <div
            className={`alert alert-${alertType} alert-dismissible fade show`}
            role="alert"
          >
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlertMessage("")}
            ></button>
          </div>
        )}

        <div className="container">
          <div className="mb-3">
            <label htmlFor="courseSelect" className="form-label">
              Select Course:
            </label>
            <select
              id="courseSelect"
              className="form-select"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              <option value="" disabled>
                Select a course...
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-4">
              <h4 style={{ color: "#fff", fontWeight: "bold" }}>
                Videos for Selected Course
              </h4>
              {videos.length > 0 ? (
                <ul className="list-group">
                  {videos.map((video) => (
                    <li
                      key={video.id}
                      className={`list-group-item ${
                        selectedVideo?.id === video.id ? "active" : ""
                      }`}
                      onClick={() => handleVideoSelect(video)}
                      style={{ cursor: "pointer" }}
                    >
                      {video.videoTitle}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#fff", fontStyle: "italic" }}>
                  No videos available for this course.
                </p>
              )}
            </div>
            <div className="col-md-8">
              {selectedVideo ? (
                <>
                  <video
                    controls
                    src={videoPreview}
                    className="video-preview mb-3"
                    style={{ width: "100%" }}
                  />
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control custom-textarea mb-3"
                    placeholder="Video Title"
                    disabled={!isEditing}
                  ></textarea>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control custom-textarea"
                    placeholder="Video Description"
                    disabled={!isEditing}
                  ></textarea>
                </>
              ) : (
                <p>Select a video to manage.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ManageVideoPages;
