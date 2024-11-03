// import React, { useEffect, useContext, useState } from "react";
import React, { useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { AuthContext } from '../helpers/AuthContext';
// import axios from "axios";
import { useNavigate } from "react-router-dom";

import PeopleIcon from "@mui/icons-material/People";

function UserProfile() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      const header = document.querySelector(".header-section");
      const bodySection = document.querySelector(".body-section");

      if (header && bodySection) {
        const headerHeight = header.offsetHeight;
        bodySection.style.marginTop = `${headerHeight}px`;
      }
    }

    const updateMarginTop = () => {
      const userProfile = document.querySelector(".user-profile");
      const personalDetail = document.querySelector(".personal-detail-section");
      const username = document.querySelector(".user-name");
      if (userProfile && personalDetail) {
        let userProfileHeight = userProfile.offsetHeight;
        if (window.innerWidth <= 768) {
          const usernameHeight = username.offsetHeight;
          userProfileHeight = userProfileHeight + usernameHeight;
        }
        personalDetail.style.marginTop = `${userProfileHeight}px`;
      }
    };

    // Gọi hàm cập nhật ngay lần đầu khi component được mount
    updateMarginTop();

    // Thêm sự kiện resize để cập nhật lại khi kích thước màn hình thay đổi
    window.addEventListener("resize", updateMarginTop);
    return () => {
      window.removeEventListener("resize", updateMarginTop);
    };
  });

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
              <h1>{authState.username}</h1>
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
                      <span>
                        {" "}
                        <PeopleIcon /> Thành viên của TNT từ tháng 10 năm 2024
                        
                      </span>
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
                        img
                        src="http://localhost:3000/course-img.png"
                        alt="User Avatar"
                        className="course-enrollment-img img-fluid"
                      />
                      <div className="course-enrollment-detail">
                        <h5>HTML CSS từ Zero đến Hero</h5>
                        <p>Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band & Shopee.</p>
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
