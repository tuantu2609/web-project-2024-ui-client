// import { Link } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from "./Header";
import "../App.css";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Footer from "./Footer";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const HomePage = ({ username }) => {
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

  return (
    <div className="home-background">
      <Header />
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
              <button className="btn btn-join">
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
          {[...Array(4)].map((_, index) => (
            <div className="card">
              <img src="vid.jpg" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Course name {1 + index}</h5>
                <p className="card-price">Cousrse....</p>
                <div className="card-info">
                  <span className="card-icon">
                    <GroupsIcon />
                    <i className="fas fa-user-friends"></i> 131.124
                  </span>
                  <span className="card-icon">
                    <FormatListBulletedIcon />
                    <i className="fas fa-eye"></i> 9
                  </span>
                  <span className="card-icon">
                    <TimerOutlinedIcon />
                    <i className="fas fa-clock"></i> 3h12p
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <div>
          <button className="btn btn-view">
            <span>View all</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
