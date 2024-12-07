import React, { useEffect, useState, useRef, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Footer from "./Footer";

import axios from "axios";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoopIcon from "@mui/icons-material/Loop";

function UploadVideoPages() {
  const { authState } = useContext(AuthContext);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null); // Ref để truy cập input file
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const { API_URL } = useContext(AuthContext);

  let navigate = useNavigate();

  const handleOptionClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else if (authState.role !== "instructor") {
      navigate("/");
    } else {
      setBodySectionMarginTop();
      window.scrollTo(0, 0);
      axios
        .get(`${API_URL}/courses/instructor`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setCourses(response.data);
          console.log("Courses:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    }
  }, [navigate, authState.role]);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto"; // Đặt chiều cao ban đầu
    e.target.style.height = `${e.target.scrollHeight}px`; // Đặt chiều cao theo nội dung
  };

  const handleChangeVideo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleConfirm = () => {
    setAlertMessage("");

    if (!videoFile) {
      setAlertMessage("Please select a video.");
      setAlertType("danger");
      return;
    }
    if (!title || !description) {
      setAlertMessage("Please fill in the title and description.");
      setAlertType("warning");
      return;
    }
    if (!selectedCourse) {
      setAlertMessage("Please select a course.");
      setAlertType("warning");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("videoTitle", title);
    formData.append("videoDesc", description);
    formData.append("courseID", selectedCourse);

    setIsUploading(true);

    axios
      .post(`${API_URL}/videos`, formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAlertMessage(
          "Video uploaded successfully!!!"
        );
        setAlertType("success");
        setIsUploading(false);
      })
      .catch((error) => {
        if (error.response) {
          setAlertMessage("Error: " + error.response.data.message);
        } else {
          setAlertMessage("Error: Unable to connect to the server.");
        }
        setAlertType("danger");
        setIsUploading(false);
      });
  };

  return (
    <div className="UploadPages-background">
      <div className="body-section">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-primary ms-3 me-3 mt-3 mb-3"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon /> Back
          </button>
          {videoPreview && (
            <>
              <button
                className="btn btn-outline-light me-3 mt-3 mb-3"
                onClick={handleChangeVideo}
              >
                <UploadFileIcon /> Change Video
              </button>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <button
                className="btn btn-success ms-auto me-3 mt-3 mb-3"
                onClick={handleConfirm}
                disabled={isUploading} // Vô hiệu hóa nút khi đang tải
              >
                {isUploading ? (
                  <LoopIcon size={24} color="inherit" /> // Hiển thị icon tải
                ) : (
                  "Upload Video"
                )}
              </button>
            </>
          )}
        </div>

        {alertMessage && (
          <div
            key={alertMessage}
            className={`alert alert-${alertType} alert-dismissible fade show`}
            role="alert"
          >
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => {
                setAlertMessage("");
                if (alertType === "success") {
                  navigate("/");
                }
              }}
            ></button>
          </div>
        )}

        <div className="container">
          <div className="d-flex align-items-center mb-3">
            <label
              htmlFor="courseSelect"
              className="form-label me-2"
              style={{
                fontFamily: "Fancy Cut, Almarai, Times, serif",
                color: "#E0E0E0",
                fontSize: "1.5rem",
              }}
            >
              Course:
            </label>
            <select
              className="form-select custom-select"
              id="courseSelect"
              value={selectedCourse}
              onChange={(e) => handleOptionClick(e.target.value)}
              required
              style={{
                width: "200px", // Adjust the width as needed
                backgroundColor: "transparent", // Make background transparent
                border: "1px solid #E0E0E0", // Optional: set a light border color
                color: "#E0E0E0", // Text color to contrast with background
                fontSize: "1rem",
              }}
            >
              <option value="" style={{ color: "#000" }} disabled>
                Select Course...
              </option>
              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                  style={{ color: "#000" }}
                >
                  {course.courseTitle}
                </option>
              ))}
            </select>
          </div>
          <div className="row justify-content-center">
            {videoPreview ? (
              <>
                <div className="col-md-7 col-sm-12">
                  <video
                    controls
                    src={videoPreview}
                    className="video-preview mb-3"
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="col-md-5 col-sm-12">
                  <textarea
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); //prevent a new line
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData
                        .getData("text")
                        .replace(/\n/g, " "); // Loại bỏ dấu xuống dòng
                      setTitle((prevTitle) => prevTitle + text); // Thêm văn bản đã xử lý vào Title
                    }}
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    className="custom-textarea mb-3"
                    required
                  ></textarea>
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      adjustTextareaHeight(e);
                    }}
                    className="custom-textarea"
                    style={{ overflow: "hidden" }}
                    required
                  ></textarea>
                </div>
              </>
            ) : (
              <div className="col-md-4 col-sm-8 text-center">
                <div className="container p-4 shadow rounded border mt-5">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="d-none"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="btn btn-outline-light"
                    style={{ cursor: "pointer" }}
                  >
                    <UploadFileIcon className="me-2" /> Select Video
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Export the LearningPages component
export default UploadVideoPages;
