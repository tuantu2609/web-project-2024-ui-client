// ViewAllCourses.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Footer from "./Footer";
import SchoolIcon from "@mui/icons-material/School";

const ViewAllCourses = () => {
  const courses = [...Array(50)].map((_, index) => ({ // Giả sử có 50 khóa học
    name: `Course name ${index + 1}`,
    description: "Course....",
    participants: 131124, 
    lessons: 9,
    duration: "3h12p",
    image: "vid.jpg", 
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  return (
    <div className="view-all-courses-background" >
    <div className="view-all-courses">
      <section className="container">
        <div className="tray">
          <h2 className="courses-title">
            <SchoolIcon /> All Courses
          </h2>
        </div>
        <div className="row">
          {currentCourses.map((course, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card">
                <img
                  src={course.image}
                  className="card-img-top"
                  alt={course.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.description}</p>
                  <div className="card-info">
                    <span className="card-icon">
                      <GroupsIcon /> {course.participants}
                    </span>
                    <span className="card-icon">
                      <FormatListBulletedIcon /> {course.lessons}
                    </span>
                    <span className="card-icon">
                      <TimerOutlinedIcon /> {course.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1} 
            className="btn btn-primary mx-1"
          >
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

          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages} 
            className="btn btn-primary mx-1"
          >
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
