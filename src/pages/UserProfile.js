import React, { useEffect, useLayoutEffect, useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { setBodySectionMarginTop } from "../helpers/styles";
import { Modal, Button, Form } from "react-bootstrap";

import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";

// Hàm cập nhật margin-top cho phần personal detail
const updatePersonalDetailMargin = () => {
  const userProfile = document.querySelector(".user-profile");
  const personalDetail = document.querySelector(".personal-detail-section");
  const username = document.querySelector(".user-name");

  if (userProfile && personalDetail) {
    let userProfileHeight = userProfile.offsetHeight;
    if (window.innerWidth <= 768 && username) {
      const usernameHeight = username.offsetHeight;
      userProfileHeight += usernameHeight;
    }
    personalDetail.style.marginTop = `${userProfileHeight}px`;
  }
};

// Hàm định dạng ngày
const formatDate = (dateString, num) => {
  try {
    if (num === 1) return format(new Date(dateString), "dd/MM/yyyy");
    return format(new Date(dateString), "MM/yyyy");
  } catch {
    return "Invalid date";
  }
};

function UserProfile() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
  const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công

  const navigate = useNavigate();

  // Hàm lấy dữ liệu người dùng
  const fetchUserData = (setUserData) => {
    axios
      .get(`http://localhost:3001/user/details`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/enrollment/enrolled",
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    fetchUserData(setUserData);
    fetchEnrolledCourses();

    // Thêm sự kiện resize để cập nhật margin khi thay đổi kích thước màn hình
    window.addEventListener("resize", updatePersonalDetailMargin);
    return () => {
      window.removeEventListener("resize", updatePersonalDetailMargin);
    };
  }, [navigate]);

  useLayoutEffect(() => {
    if (userData) {
      setBodySectionMarginTop();
      setTimeout(updatePersonalDetailMargin, 50);
      setEditData({
        fullName: authState?.fullName || "",
        birthDate: userData.userDetails?.birthDate || "",
        phoneNumber: userData.userDetails?.phoneNumber || "",
        address: userData.userDetails?.address || "",
        profilePictureURL: userData.userDetails?.profilePictureURL || "",
      });
    }
  }, [userData, authState?.fullName]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      setEditData({ ...editData, [name]: value || "" });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSave = () => {
    setIsLoading(true); // Bật trạng thái tải
    setSuccessMessage(""); // Xóa thông báo cũ

    const formData = new FormData(); // Dùng để chứa dữ liệu và file
    const updatedFields = {};

    // Kiểm tra các trường thay đổi
    Object.keys(editData).forEach((key) => {
      if (
        key !== "profilePictureURL" && // Bỏ qua trường ảnh ở đây
        editData[key] !== userData.userDetails[key] &&
        editData[key]?.trim() !== ""
      ) {
        updatedFields[key] = editData[key];
      }
    });

    // Thêm dữ liệu thay đổi vào FormData
    Object.keys(updatedFields).forEach((key) => {
      formData.append(key, updatedFields[key]);
    });

    // Xử lý ảnh nếu người dùng tải lên
    const fileInput = document.getElementById("profilePictureInput");
    if (fileInput?.files?.length > 0) {
      formData.append("profilePicture", fileInput.files[0]); // Thêm file ảnh vào FormData
    }

    // Gửi yêu cầu API
    axios
      .put("http://localhost:3001/user/details", formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setSuccessMessage("Profile updated successfully!");
        fetchUserData(setUserData); // Tải lại dữ liệu người dùng
        setShowEditModal(false);
        if (updatedFields.fullName) {
          setAuthState((prev) => ({
            ...prev,
            fullName: updatedFields.fullName,
          }));
        }
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
      })
      .finally(() => {
        setIsLoading(false); // Tắt trạng thái tải
      });
  };

  return (
    <div>
      <div className="body-section container-fluid">
        <div className="banner container-lg">
          <img
            className="img-fluid rounded-bottom-custom banner-img"
            src="banner.png"
            alt="banner"
          />
          <div className="user-profile">
            <div className="avatar-container">
              <img
                src={
                  editData.profilePictureURL ||
                  "/public/UserAvatar.png"
                }
                alt="User Avatar"
                className="avatar rounded-circle"
              />
            </div>
            <div className="user-name ms-2">
              <h1 style={{ fontWeight: "bold" }}>{authState.fullName}</h1>
            </div>
          </div>
        </div>
        <div className="personal-detail-section container-lg">
          {successMessage && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {successMessage}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setSuccessMessage("")} // Đặt lại successMessage khi đóng
              ></button>
            </div>
          )}
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="left-side container-lg">
                <div className="row">
                  <div className="col-12">
                    <div className="Introduction">
                      <h4 className="d-flex align-items-center justify-content-between">
                        Giới thiệu
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => setShowEditModal(true)}
                          className="edit-btn"
                        >
                          <EditIcon />
                        </Button>
                      </h4>

                      {userData?.userDetails ? (
                        <>
                          <p>
                            <strong>Phone number:</strong>{" "}
                            {userData.userDetails.phoneNumber}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {userData.userDetails.address ||
                              "No address provided"}
                          </p>
                          <p>
                            <strong>Date of Birth:</strong>{" "}
                            {formatDate(userData.userDetails.birthDate, 1)}
                          </p>
                          <hr />
                          <span>
                            <PeopleIcon /> Thành viên của TNT từ{" "}
                            {formatDate(userData.userDetails.createdAt, 0)}
                          </span>
                        </>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <h4>Hoạt động gần đây</h4>
                    <p>Chưa có hoạt động gần đây</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="right-side container-lg">
                <h4>Các khóa học đã tham gia</h4>
                <div className="row">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                      <div
                        className="col-12"
                        key={course.courseId}
                        onClick={() =>
                          navigate(
                            `/learn/${course.courseId}/${course.firstVideoId}`
                          )
                        } // Thêm sự kiện onClick để chuyển hướng
                        style={{ cursor: "pointer" }}
                      >
                        <div className="course-enrollment-display mb-3">
                          <img
                            src={course.thumbnail || "/public/vid.jpg"}
                            alt={course.courseTitle}
                            className="course-enrollment-img img-fluid"
                          />
                          <div className="course-enrollment-detail">
                            <h5>{course.courseTitle}</h5>
                            <p>{course.courseDesc}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Bạn chưa tham gia khóa học nào.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* EDIT PROFILE */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={editData.fullName}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter your address"
                value={editData.address}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formBirthDate" className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={
                  editData.birthDate
                    ? format(new Date(editData.birthDate), "yyyy-MM-dd")
                    : ""
                }
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={editData.phoneNumber}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formProfilePicture" className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <div className="text-center mb-2">
                {editData.profilePictureURL && (
                  <img
                    src={editData.profilePictureURL}
                    alt="Preview"
                    className="img-thumbnail rounded-circle"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                )}
              </div>
              <Form.Control
                type="file"
                id="profilePictureInput"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditData({
                      ...editData,
                      profilePictureURL: URL.createObjectURL(file), // Hiển thị ảnh tạm thời
                    });
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-cancel"
            onClick={() => setShowEditModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="btn-save"
            onClick={handleSave}
            disabled={isLoading} // Disable khi đang tải
          >
            {isLoading ? "Saving..." : "Save Changes"}{" "}
            {/* Thay đổi text khi đang tải */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
