import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import "../App.css";
import { setBodySectionMarginTop } from "../helpers/styles";
import { convertDuration } from "../helpers/time";

function LearningPages() {
  const { courseId, videoId } = useParams();
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showLessonList, setShowLessonList] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { API_URL } = useContext(AuthContext);

  const findVideoIndexById = (videos, videoId) => {
    return videos.findIndex((video) => video.videoId === parseInt(videoId));
  };

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
    setShowFullDesc(false);
  };

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`${API_URL}/courseVideo/course-le/${courseId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        const videosWithFormattedDuration = response.data.map((video) => ({
          ...video,
          // videoDuration: convertDuration(video.Video.videoDuration),
          videoDuration: convertDuration(Math.round(video.Video.videoDuration)),
        }));
        setVideos(videosWithFormattedDuration);

        const initialIndex = findVideoIndexById(
          videosWithFormattedDuration,
          videoId
        );
        setCurrentVideoIndex(initialIndex >= 0 ? initialIndex : 0); // Nếu không tìm thấy, mặc định 0

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [courseId, videoId]);

  useEffect(() => {
    if (videos) {
      setBodySectionMarginTop();
    }
  }, [videos]);

  if (isLoading) return <p>Loading videos...</p>;

  return (
    <div>
      <div className="body-section">
        <div className="row">
          {/* Recent video */}
          <div className={showLessonList ? "col-md-7 col-sm-12" : "col-12"}>
            {/* Video section */}
            <div className="video-container">
              {videos.length > 0 ? (
                <video
                  key={videos[currentVideoIndex].Video.videoURL}
                  width="100%"
                  height={showLessonList ? "auto" : "600"}
                  autoPlay
                  controls
                >
                  <source
                    src={videos[currentVideoIndex].Video.videoURL}
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
                <h5>{videos[currentVideoIndex].Video.videoTitle}</h5>
                <pre className="mt-3">
                  {videos[currentVideoIndex].Video.videoDesc
                    ? showFullDesc
                      ? videos[currentVideoIndex].Video.videoDesc
                      : `${videos[currentVideoIndex].Video.videoDesc.slice(
                          0,
                          100
                        )}...`
                    : "No description available"}
                </pre>
                <button
                  className="btn btn-link p-0"
                  style={{ color: "black" }}
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "Read less" : "Read more"}
                </button>
              </div>
            )}
          </div>

          {/* Show this only when showLessonList === true */}
          {showLessonList && (
            <div className="col-md-5 col-sm-12">
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
                        <div className="fw-bold">{video.Video.videoTitle}</div>
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
          className="btn btn-dark mt-3 ms-3"
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
    </div>
  );
}

// Export the LearningPages component
export default LearningPages;
