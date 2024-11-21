import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { convertDuration } from "../helpers/time";

import axios from "axios";

import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function ViewCourseDetail() {
  const { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [canViewVideos, setCanViewVideos] = useState(false);

  let navigate = useNavigate();

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (authState.role === "instructor") {
      setAlertMessage("Enrollment is only available for students.");
      setAlertType("warning");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/enrollment/enroll",
        { courseId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setAlertMessage(response.data.message);
      setAlertType("success");
    } catch (error) {
      console.error(
        "Error enrolling in course:",
        error.response?.data?.message || error.message
      );
      setAlertMessage(
        error.response?.data?.message || "Enrollment failed. Please try again."
      );
      setAlertType("danger");
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/courses/${id}`).then((response) => {
      setCourse(response.data);
    });
    axios
      .get(`http://localhost:3001/courseVideo/course-re/${id}`)
      .then((response) => {
        setVideos(response.data);
      });
  }, [id]);

  useEffect(() => {
    if (course) {
      setBodySectionMarginTop();
    }
  }, [course]);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Kiểm tra người dùng có phải là instructor
        if (authState.id === course?.Instructor?.id) {
          setCanViewVideos(true);
          setIsEnrolled(true); // Instructor tự động xem được video
          return;
        }

        // Kiểm tra người dùng đã ghi danh hay chưa
        const response = await axios.get(
          `http://localhost:3001/enrollment/check-enrollment/${id}`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );
        setCanViewVideos(response.data.enrolled);
        setIsEnrolled(response.data.enrolled);
      } catch (error) {
        console.error("Error checking permissions:", error);
        setCanViewVideos(false); // Không cho phép nếu có lỗi
        setIsEnrolled(false);
      }
    };

    if (course) {
      checkPermissions();
    }
  }, [authState.id, course, id]);

  if (!course) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-detail-background">
      <div className="body-section container">
        <button
          className="btn btn-primary mt-3 mb-3"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon /> Back
        </button>
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
                  navigate(`/learn/${id}/${videos[0].videoId}`);
                }
              }}
            ></button>
          </div>
        )}
        <div className="row course-detail-container d-flex align-items-center">
          <div className="col-md-4 col-sm-12 d-flex justify-content-center mb-3">
            <img
              src={course?.thumbnail ? course.thumbnail : "/vid.jpg"}
              alt={course?.courseTitle || "Default Thumbnail"}
              className="img-fluid"
            />
          </div>
          <div className="col-md-8 col-sm-12 d-flex flex-column justify-content-center text-md-start text-center">
            <h1 className="course-title">{course?.courseTitle}</h1>
            <p className="course-desc">{course?.courseDesc}</p>
          </div>
          {!isEnrolled && (
            <div className="col-12 text-md-start text-center mt-3">
              {course?.Instructor?.UserDetail?.fullName && (
                <p className="course-instructor">
                  <strong>Instructor: </strong>
                  {course.Instructor.UserDetail.fullName}
                </p>
              )}
              <div className="d-flex flex-column flex-md-row justify-content-md-start justify-content-center align-items-center gap-3">
                <p className="course-price fw-bold mb-0">
                  {course?.coursePrice > 0
                    ? `Price: $${course.coursePrice}`
                    : "Free"}
                </p>
                <button
                  className="btn btn-primary enroll-btn"
                  onClick={() => handleEnroll(id)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="row course-detail-container mt-5">
          {videos.length > 0 ? (
            <ul className="list-group">
              {videos.map((video, index) => (
                <li
                  key={video.videoId}
                  className={`list-group-item d-flex align-items-center ${
                    canViewVideos ? "cursor-pointer" : "disabled"
                  }`}
                  style={{ cursor: canViewVideos ? "pointer" : "not-allowed" }}
                  onClick={() =>
                    canViewVideos
                      ? navigate(`/learn/${id}/${video.videoId}`)
                      : alert("You do not have permission to view this video.")
                  }
                >
                  <PlayCircleIcon
                    className="me-3"
                    style={{ color: canViewVideos ? "#2e97dd" : "grey" }}
                  />

                  {/* Số thứ tự và tiêu đề video */}
                  <div className="d-flex flex-grow-1">
                    <span className="me-2">{index + 1}. </span>
                    <span className="fw-bold">{video.Video.videoTitle}</span>
                  </div>

                  {/* Thời lượng video */}
                  <span className="badge text-bg-secondary rounded-pill">
                    {convertDuration(video.Video.videoDuration)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No videos available for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCourseDetail;
