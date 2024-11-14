import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../App.css";
import Footer from "./Footer";

const ViewCourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3001/courses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course data.");
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!course) return <p>No course data found.</p>;

  return (
    <div className="course-detail-background">
      <div className="container course-detail-container">
        <div className="row course-header align-items-center">
          <div className="col-md-2 text-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Logo"
              className="course-logo img-fluid"
            />
          </div>
          <div className="col-md-10">
            <h1 className="course-title">{course.courseTitle}</h1>
            <p className="course-desc">{course.courseDesc}</p>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewCourseDetail;
