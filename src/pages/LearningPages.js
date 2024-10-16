import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from "./Header";
import axios from "axios";

function LearningPages() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showLessonList, setShowLessonList] = useState(true);

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

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
  };

  useEffect(() => {
    const header = document.querySelector(".header-section");
    const bodySection = document.querySelector(".body-section");

    if (header && bodySection) {
      const headerHeight = header.offsetHeight;
      bodySection.style.marginTop = `${headerHeight}px`;
    }

    axios.get(`http://localhost:3001/videos`).then((response) => {
      const videosWithFormattedDuration = response.data.map((video) => ({
        ...video,
        videoDuration: convertDuration(video.videoDuration), // Chuyển đổi
      }));
      setVideos(videosWithFormattedDuration);
    });
  }, []);

  return (
    <div>
      <Header />

      <div className="body-section">
        <div className="row">
          {/* Recent video */}
          <div className={showLessonList ? "col-7" : "col-12"}>
            {/* Video section */}
            <div className="video-container">
              {videos.length > 0 ? (
                <video
                  key={videos[currentVideoIndex].videoURL}
                  width="100%"
                  height={showLessonList ? "auto" : "600"}
                  autoPlay
                  controls
                >
                  <source
                    src={videos[currentVideoIndex].videoURL}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>No video available</p>
              )}
            </div>

            {/* Video Title and Video Description */}
            {videos.length > 0 && (
              <div className="mt-3 ms-3">
                <h5>{videos[currentVideoIndex].videoTitle}</h5>
                <pre className="mt-3">
                  {videos[currentVideoIndex].videoDesc}
                </pre>
              </div>
            )}
          </div>

          {/* Show this only when showLessonList === true */}
          {showLessonList && (
            <div className="col-5">
              <div className="lesson-list mt-2">
                <h3>Lesson list</h3>
                <ul className="list-group list-group-numbered">
                  {videos.map((video, index) => (
                    <li
                      key={video.id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
                        index === currentVideoIndex ? "active" : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        // backgroundColor:
                        //   index === currentVideoIndex ? "#f0f0f0" : "",
                      }}
                      onClick={() => handleVideoChange(index)}
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{video.videoTitle}</div>
                        <span className="badge text-bg-secondary rounded-pill">
                          {video.videoDuration}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Button to show Lesson List */}
        <button
          className="btn btn-dark mt-3"
          onClick={() => {
            setShowLessonList(!showLessonList);
            window.scrollTo({
              top: 0,
              behavior: "smooth", // Cuộn mượt mà
            });
          }}
        >
          {showLessonList ? "Hide" : "Show"}
        </button>
      </div>

      {/* <div className="footer-section">
        <div className="container">
          <span className="text-muted">© 2024 Học tập trực tuyến</span>
        </div>
      </div> */}
    </div>
  );
}

export default LearningPages;
