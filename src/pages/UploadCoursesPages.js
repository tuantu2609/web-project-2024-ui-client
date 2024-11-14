import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import axios from "axios";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function UploadCoursesPages() {
  const { authState } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
    else if (authState.role !== "teacher") {
      navigate("/");
    }
    else {
      setBodySectionMarginTop();
      window.scrollTo(0, 0);
    }
  }, [navigate, authState.role]);

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleUpload = async () => {
    if (title && description) {
      const data = {
        courseTitle: title,
        courseDesc: description,
      };
      axios
        .post(
          `http://localhost:3001/courses`,
          data, // Pass data as the second argument
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then((response) => {
          if (response.data.error) {
            setAlertType("danger");
            setAlertMessage(response.data.error);
          } else {
            setAlertType("success");
            setAlertMessage("Course uploaded successfully!");
          }
        })
        .catch((error) => {
          console.error("Error uploading course:", error);
          setAlertType("danger");
          setAlertMessage("Failed to upload course");
        });
    } else {
      setAlertType("danger");
      setAlertMessage("Please provide course title and description");
    }
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
          <button
            className="btn btn-success ms-auto me-3 mt-3 mb-3"
            onClick={handleUpload}
          >
            Upload Course
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
            <div className="col-12 mb-3">
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
