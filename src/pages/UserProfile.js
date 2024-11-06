import React, { useEffect, useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { setBodySectionMarginTop } from "../helpers/styles";

import PeopleIcon from "@mui/icons-material/People";

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

const formatDate = (dateString, num) => {
  if (num === 1) return format(new Date(dateString), "dd/MM/yyyy");
  else
    return format(new Date(dateString), "MM/yyyy");
};

function UserProfile() {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
    setTimeout(() => {
      setBodySectionMarginTop();
      updatePersonalDetailMargin();
    }, 50);

    fetchUserData(setUserData);

    // Thêm sự kiện resize để cập nhật margin khi thay đổi kích thước màn hình
    window.addEventListener("resize", updatePersonalDetailMargin);
    return () => {
      window.removeEventListener("resize", updatePersonalDetailMargin);
    };
  }, [navigate]);

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
                src="http://localhost:3000/UserAvatar.png"
                alt="User Avatar"
                className="avatar rounded-circle"
              />
            </div>
            <div className="user-name ms-2">
              <h1 style={{ fontWeight: 'bold' }}>{authState.fullName}</h1>
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
                      <h4>Giới thiệu</h4>
                      {userData && userData.userDetails ? (
                        <>
                          {/* <p>{userData.userDetails.fullName}</p>
                          <hr /> */}
                          <p>
                            <strong>Phone number:</strong>{" "}
                            {userData.userDetails.phoneNumber}
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
    </div>
  );
}

export default UserProfile;
