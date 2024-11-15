import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import axios from "axios";

import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function ViewCourseDetail() {
  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);

  function convertDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Tạo định dạng
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(secs).padStart(2, "0")}`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
    } else {
      return `00:${String(secs).padStart(2, "0")}`;
    }
  }

  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/courses/${id}`).then((response) => {
      setCourse(response.data);
    });
    axios
      .get(`http://localhost:3001/videos/course/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setVideos(response.data);
      });
  }, [id]);

  useEffect(() => {
    if (course) {
      setBodySectionMarginTop();
    }
  }, [course]);

  if (!course) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-detail-background">
      {/* <div className="body-section container"> */}
      <div className="body-section container" style={{ paddingTop: "5%" }}>
        <div className="row course-detail-container d-flex align-items-center justify-content-center text-center">
          <div className="col-md-2 col-sm-12 d-flex justify-content-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Logo"
              className="course-logo img-fluid"
            />
          </div>
          <div className="col-md-10 col-sm-12">
            <h1 className="course-title">{course?.courseTitle}</h1>
            <p className="course-desc">{course?.courseDesc}</p>
          </div>
        </div>
        <div className="row course-detail-container mt-5">
          {videos.length > 0 ? (
            <ul className="list-group">
              {videos.map((video, index) => (
                <li
                  key={video.videoId}
                  className="list-group-item d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <PlayCircleIcon className="me-3" style={{ color: "#2e97dd" }} />

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
