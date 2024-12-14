import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Footer from "./Footer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { setBodySectionMarginTop } from "../helpers/styles";
import { AuthContext } from "../helpers/AuthContext";

const HomePage = ({ username }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
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

  useEffect(() => {

    setBodySectionMarginTop();
    fetch(`${API_URL}/courses`)
      .then((response) => response.json())
      // .then((data) => setCourses(data)) //Nếu muốn hiện hết thì dùng dòng này
      .then((data) => { // Lọc chỉ các khóa học có status là "active"
        const activeCourses = data.filter(
          (course) => course.status === "active"
        );
        setCourses(activeCourses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [API_URL]);

  const token = localStorage.getItem("accessToken");
  const handleJoinClick = () => {
    if (token) {
      navigate("/courses/view-all");
    } else {
      navigate("/login");
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
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
              Học kém, <strong className="color-pass">do bạn.</strong>
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
          {courses.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="carousel-item-wrapper"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="card">
                <img
                  src={course.thumbnail || "/vid.jpg"}
                  className="card-img-top"
                  alt={course.courseTitle || "Course Thumbnail"}
                  // style={{ width: "100%", height: "259px", objectFit: "cover" }}
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
      </section>
      <div className="container">
        <button
          onClick={() => navigate("/courses/view-all")}
          className="btn btn-view"
        >
          <span>View all</span>
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
