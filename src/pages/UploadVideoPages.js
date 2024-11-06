import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";


function UploadVideoPages() {
  const [videoPreview, setVideoPreview] = useState(null); // Lưu trữ video để xem trước
  const [videoFile, setVideoFile] = useState(null); // Lưu trữ file video
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setBodySectionMarginTop();
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="body-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-sm-12"></div>
            <div className="col-md-5 col-sm-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the LearningPages component
export default UploadVideoPages;
