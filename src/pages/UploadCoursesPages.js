import React, { useEffect, useState, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import axios from "axios";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function UploadCoursesPages() {
  const { authState } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null); // Ref để truy cập input file

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else if (authState.role !== "instructor") {
      navigate("/");
    } else {
      setBodySectionMarginTop();
      window.scrollTo(0, 0);
    }
  }, [navigate, authState.role]);

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          canvas.width = 460;
          canvas.height = 259;
  
          ctx.drawImage(img, 0, 0, 460, 259);
  
          // Chuyển canvas thành Blob (dữ liệu ảnh)
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              setThumbnailFile(resizedFile); // Lưu file đã chỉnh sửa vào state
              setThumbnailPreview(URL.createObjectURL(blob)); // Hiển thị ảnh preview
            },
            file.type,
            1
          );
        };
      };
  
      reader.readAsDataURL(file); // Đọc file ảnh dưới dạng Data URL
    }
  };

  const handleChangeThumbnail = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!title || !description) {
      setAlertType("danger");
      setAlertMessage("Please provide course title and description.");
      return;
    }

    const formData = new FormData();
    formData.append("courseTitle", title);
    formData.append("courseDesc", description);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    setIsUploading(true);

    axios
      .post("http://localhost:3001/courses", formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAlertType("success");
        setAlertMessage("Course uploaded successfully, wait for admin response!");
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("Error uploading course:", error);
        setAlertType("danger");
        setAlertMessage("Failed to upload course.");
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
          {thumbnailPreview && (
            <button
              className="btn btn-outline-light"
              onClick={handleChangeThumbnail}
            >
              <UploadFileIcon className="me-2" /> Change Thumbnail
            </button>
          )}
          <button
            className="btn btn-success ms-auto me-3 mt-3 mb-3"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Course"}
          </button>
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
          <div className="row justify-content-start">
            <div className="col-12 d-flex align-items-center mb-3">
              <h3
                className="me-3 mb-3"
                style={{
                  fontFamily: "Fancy Cut, Almarai, Times, serif",
                  fontWeight: "bold",
                  color: "#E0E0E0",
                }}
              >
                Lecturer Name:
              </h3>
              <textarea
                value={authState.fullName}
                className="mb-3 text-center custom-textarea"
                style={{
                  fontWeight: "bold",
                  maxWidth: "600px",
                  color: "#FFFFFF",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid #E0E0E0",
                }}
                disabled
              ></textarea>
            </div>
          </div>
          <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12 text-center">
              {thumbnailPreview ? (
                <div className="mb-3">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "300px" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="d-none"
                    id="thumbnail-input"
                  />
                  <label
                    htmlFor="thumbnail-input"
                    className="btn btn-outline-light"
                  >
                    <UploadFileIcon className="me-2" /> Select Thumbnail
                  </label>
                </div>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
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
                style={{ overflow: "hidden" }}
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

          </div>
        </div>
      </div>
    </div>
  );
}

// Export the LearningPages component
export default UploadCoursesPages;
