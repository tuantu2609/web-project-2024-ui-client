import React, { useEffect, useState, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setBodySectionMarginTop } from "../helpers/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import axios from "axios";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LoopIcon from "@mui/icons-material/Loop";

function ManageCoursesPages() {
  const { authState } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Prevent editing until update is clicked
  const [initialState, setInitialState] = useState({}); // To store original values
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else if (authState?.role === "instructor") {
      axios
        .get("http://52.7.83.229:3001/courses/instructor", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        })
        .finally(() => setLoading(false));
    } else {
      navigate("/"); // Redirect non-instructors
    }
  }, [authState, navigate]);

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

  const handleOptionClick = (courseId) => {
    setSelectedCourse(courseId);

    // Find the selected course
    const course = courses.find((c) => c.id === parseInt(courseId));
    if (course) {
      setTitle(course.courseTitle);
      setDescription(course.courseDesc);
      setThumbnailPreview(course.thumbnail);

      // Save the initial state of the course
      setInitialState({
        title: course.courseTitle,
        description: course.courseDesc,
        thumbnailPreview: course.thumbnail,
      });

      setIsUpdating(true);
      setIsEditing(false); // Disable editing until the "Update Course" button is clicked
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

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

          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              setThumbnailFile(resizedFile);
              setThumbnailPreview(URL.createObjectURL(blob));
            },
            file.type,
            1
          );
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChangeThumbnail = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveCourse = async () => {
    // Validate input fields
    if (!title || !description) {
      setAlertType("danger");
      setAlertMessage("Please provide course title and description.");
      return;
    }

    // Ensure a course is selected
    if (!selectedCourse) {
      setAlertType("danger");
      setAlertMessage("Please select a course to update.");
      return;
    }

    // Prepare the form data for the update request
    const formData = new FormData();
    formData.append("courseTitle", title);
    formData.append("courseDesc", description);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    setIsUploading(true); // Set uploading state to true

    try {
      const response = await axios.put(
        `http://52.7.83.229:3001/courses/${selectedCourse}`, // Update endpoint
        formData,
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setAlertType("success");
        setAlertMessage("Course updated successfully!");
        setIsEditing(false); // Disable editing mode
        setThumbnailFile(null); // Clear the thumbnail file to avoid conflicts

        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === parseInt(selectedCourse)
              ? {
                  ...course,
                  courseTitle: title,
                  courseDesc: description,
                  thumbnail: thumbnailFile
                    ? thumbnailPreview
                    : course.thumbnail, // Update thumbnail only if changed
                }
              : course
          )
        );
      } else {
        throw new Error("Unexpected response from server."); // Catch non-200 responses
      }
    } catch (error) {
      // Log and handle error responses
      console.error("Error updating course:", error);
      setAlertType("danger");
      setAlertMessage(
        error.response?.data?.message ||
          "Failed to update course. Please try again."
      );
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  const handleCancel = () => {
    // Restore initial state
    setTitle(initialState.title);
    setDescription(initialState.description);
    setThumbnailPreview(initialState.thumbnailPreview);
    setThumbnailFile(null); // Reset thumbnail file to prevent unintended changes
    setIsEditing(false); // Stop editing
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) {
      setAlertType("danger");
      setAlertMessage("Please select a course to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setIsDeleting(true); // Bật trạng thái đang xóa

    try {
      const response = await axios.delete(
        `http://52.7.83.229:3001/courses/${selectedCourse}`,
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.status === 200) {
        setAlertType("success");
        setAlertMessage("Course deleted successfully!");

        // Remove the deleted course from the list
        setCourses(
          courses.filter((course) => course.id !== parseInt(selectedCourse))
        );
        setSelectedCourse(""); // Reset selected course
        setTitle("");
        setDescription("");
        setThumbnailPreview(null);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setAlertType("danger");
      setAlertMessage(
        error.response?.data?.message ||
          "Failed to delete course. Please try again."
      );
    } finally {
      setIsDeleting(false); // Tắt trạng thái đang xóa
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
              disabled={!isEditing}
            >
              <UploadFileIcon className="me-2" /> Change Thumbnail
            </button>
          )}
          {isEditing ? (
            <button
              className="btn btn-success ms-auto me-3 mt-3 mb-3"
              onClick={handleSaveCourse}
              disabled={isUploading}
            >
              {isUploading ? <LoopIcon /> : "Confirm"}
            </button>
          ) : (
            isUpdating && (
              <div className="d-flex align-items-center ms-auto me-3 mt-3 mb-3">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleStartEditing}
                  disabled={isDeleting} // Disable khi đang xóa
                >
                  Update Course
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteCourse}
                  disabled={isDeleting} // Disable khi đang xóa
                >
                  {isDeleting ? <LoopIcon /> : "Delete Course"}
                </button>
              </div>
            )
          )}
          {isUpdating && isEditing && (
            <button
              className="btn btn-secondary ms-2 me-3 mt-3 mb-3"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>

        {alertMessage && (
          <div
            className={`alert alert-${alertType} alert-dismissible fade show`}
            role="alert"
          >
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => setAlertMessage("")}
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
                width: "200px",
                backgroundColor: "transparent",
                border: "1px solid #E0E0E0",
                color: "#E0E0E0",
                fontSize: "1rem",
              }}
            >
              <option value="" disabled>
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

          <div className="row justify-content-start">
            <div className="col-md-6 col-sm-12 text-center">
              {thumbnailPreview ? (
                <div>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="img-fluid rounded shadow mb-3"
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
                <div>
                  <p style={{ color: "#fff", fontWeight: "bold" }}>
                    No thumbnail available
                  </p>
                  <label
                    className={`btn btn-outline-light ${
                      !isEditing ? "disabled" : ""
                    }`}
                  >
                    <UploadFileIcon className="me-2" /> Select Thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <textarea
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ overflow: "hidden" }}
                className="custom-textarea mb-3"
                disabled={!isEditing}
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
                disabled={!isEditing}
                required
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCoursesPages;
