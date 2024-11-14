import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Footer from "./Footer";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";

const ViewAllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    fetch("http://localhost:3001/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCourseClick = (id) => {
    navigate(`/courses/${id}`); // Điều hướng đến trang chi tiết của khóa học
  };

  return (
    <div className="view-all-courses-background">
      <div className="view-all-courses">
        <section className="container">
          <div className="tray">
            <h2 className="courses-title">
              <SchoolIcon /> All Courses
            </h2>
          </div>
          <div className="row">
            {currentCourses.map((course) => (
              <div key={course.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card" onClick={() => handleCourseClick(course.id)} style={{ cursor: "pointer" }}>
                  <img
                    src={course.image || `${process.env.PUBLIC_URL}/vid.jpg`}
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
          </div>

          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="btn btn-primary mx-1">
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index + 1)}
                className={`btn mx-1 ${currentPage === index + 1 ? "btn-secondary" : "btn-outline-secondary"}`}
              >
                {index + 1}
              </button>
            ))}

            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn btn-primary mx-1">
              Next
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllCourses;