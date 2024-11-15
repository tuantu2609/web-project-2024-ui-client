import React from "react";
import { setBodySectionMarginTop } from "../helpers/styles";
import "../App.css";
import Footer from "./Footer";

function AdminDashboard() {
  setBodySectionMarginTop();
  return (
    <div>
      welcome to admin dashboard!!!!!!
      <Footer/>
    </div>
  );
}

export default AdminDashboard;
