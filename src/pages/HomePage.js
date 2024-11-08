import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Footer from "./Footer";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const HomePage = ({ username }) => {
  const [courses, setCourses] = useState([]); // State để lưu trữ dữ liệu courses từ API

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4, // Show 4 cards at a time
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  let navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/courses") // Thay đường dẫn bằng API của bạn
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const token = localStorage.getItem("accessToken");
  const handleJoinClick = () => {
    if (token) {
      navigate("/progress");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-background">
      <section className="courses">
        <div className="container">
          <div className="courses-content">
            <h1 className="h1 courses-title">
              <strong className="color-tt">
                T&T - Công ty TNHH 2 thành viên{" "}
              </strong>
            </h1>
            <h2 className="h2 courses-title">
              <strong>Học giỏi, </strong>
              <strong className="color-pass">do chúng tôi; </strong>
              Học kém,
              <strong className="color-pass"> do bạn.</strong>
            </h2>
            <div>
              <button onClick={handleJoinClick} className="btn btn-join">
                <span>Join now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="about container">
        <div>
          <div className="row">
            <div className="col-lg-6">
              <h2 className="h2 courses-title con">Courses list</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="displayed container">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={false}
          draggable={false}
        >
          {courses.slice(0, 4).map((course, index) => (
            <div key={index} className="carousel-item-wrapper">
              {" "}
              {/* Wrapper for custom styling */}
              <div className="card">
                <img
                  src={course.image || `${process.env.PUBLIC_URL}/vid.jpg`} // Default image if no course image
                  className="card-img-top"
                  alt={course.courseTitle}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.courseTitle}</h5>
                  <div className="card-info">
                    <span className="card-icon">
                      <GroupsIcon /> {course.participants || 0}
                    </span>
                    <span className="card-icon">
                      <FormatListBulletedIcon /> {course.lessons || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <div>
          <button
            onClick={() => navigate("/courses/view-all")}
            className="btn btn-view"
          >
            <span>View all</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
