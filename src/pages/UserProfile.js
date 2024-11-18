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
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    fetchUserData(setUserData);

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
        fullName: userData.userDetails?.fullName || "",
        birthDate: userData.userDetails?.birthDate || "",
        phoneNumber: userData.userDetails?.phoneNumber || "",
        address: userData.userDetails?.address || "",
        profilePictureURL: userData.userDetails?.profilePictureURL || "",
      });
    }
  }, [userData]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      setEditData({ ...editData, [name]: value || "" });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/bmp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(
          "Invalid file type. Only JPEG, PNG, JPG, GIF, and BMP are allowed."
        );
        return;
      }

      // Validate file size (e.g., less than 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the maximum limit of 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      // Upload the file
      axios
        .post(`http://localhost:3001/user/upload-profile-picture`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          // Update profile picture URL in state
          setEditData({ ...editData, profilePictureURL: response.data.url });
          alert("Upload successful!");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
        });
    }
  };

  const handleSave = () => {
    const updatedFields = {};
    Object.keys(editData).forEach((key) => {
      if (
        editData[key] !== userData.userDetails[key] && // Check if the value is updated
        editData[key]?.trim() !== "" // Ensure the value is not empty
      ) {
        updatedFields[key] = editData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setShowEditModal(false);
      return;
    }

    axios
      .put(`http://localhost:3001/user/update`, updatedFields, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setShowEditModal(false);
        fetchUserData(setUserData); // Làm mới userData
        // Cập nhật authState nếu fullName thay đổi
        if (updatedFields.fullName) {
          setAuthState((prev) => ({
            ...prev,
            fullName: updatedFields.fullName,
          }));
        }
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
      });
  };

  return (
    <div>
      <div className="body-section container-fluid">
        <div className="banner container-lg">
          <img
            className="img-fluid rounded-bottom-custom banner-img"
            src="http://localhost:3000/banner.png"
            alt="banner"
          />
          <div className="user-profile">
            <div className="avatar-container">
              <img
                src={
                  editData.profilePictureURL ||
                  "http://localhost:3000/UserAvatar.png"
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
                  <div className="col-12">
                    <div className="course-enrollment-display">
                      <img
                        src="http://localhost:3000/course-img.png"
                        alt="Course Thumbnail"
                        className="course-enrollment-img img-fluid"
                      />
                      <div className="course-enrollment-detail">
                        <h5>HTML CSS từ Zero đến Hero</h5>
                        <p>
                          Trong khóa này chúng ta sẽ cùng nhau xây dựng giao
                          diện 2 trang web là The Band & Shopee.
                        </p>
                      </div>
                    </div>
                  </div>
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
                value={editData.birthDate?.split("T")[0] || ""}
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
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn-cancel"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" className="btn-save" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
