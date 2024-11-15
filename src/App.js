import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Importing Pages
import Login from "./pages/Login";
import LearningPages from "./pages/LearningPages";
import Registration from "./pages/Registration";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfile";
import Header from "./pages/Header";
import UploadCoursesPages from "./pages/UploadCoursesPages";
import UploadVideoPages from "./pages/UploadVideoPages";
import ViewAllCourses from "./pages/ViewAllCourses";
import ViewCourseDetail from "./pages/ViewCourseDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Importing libraries
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    fullName: "",
    id: 0,
    role: "",
    status: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      if (role === "admin") {
        axios
        .get("http://localhost:3001/admin/auth", {
          headers: {
            accessToken: token,
          },
        })
        .then((response) => {
          if (response.data.error) {
            setAuthState((prevState) => ({ ...prevState, status: false }));
          } else {
            setAuthState((prevState) => ({
              ...prevState,
              fullName: response.data.fullName,
              id: response.data.id,
              role: response.data.role,
              status: true,
            }));
          }
        })
        .catch((error) => {
          console.error("Error during user auth:", error);
          setAuthState((prevState) => ({ ...prevState, status: false }));
        });
      } else {
        axios
          .get("http://localhost:3001/auth/user", {
            headers: {
              accessToken: token,
            },
          })
          .then((response) => {
            if (response.data.error) {
              setAuthState((prevState) => ({ ...prevState, status: false }));
            } else {
              setAuthState((prevState) => ({
                ...prevState,
                fullName: response.data.fullName,
                id: response.data.id,
                role: response.data.role,
                status: true,
              }));
            }
          })
          .catch((error) => {
            console.error("Error during user auth:", error);
            setAuthState((prevState) => ({ ...prevState, status: false }));
          });
      }
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          {/* useLocation phải được đặt bên trong Router */}
          <ConditionalHeader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/learn" element={<LearningPages />} />
            <Route path="/upload-courses" element={<UploadCoursesPages />} />
            <Route path="/upload-video" element={<UploadVideoPages />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/courses/view-all" element={<ViewAllCourses />} />
            <Route path="/courses/:id" element={<ViewCourseDetail />} />
            <Route path="/tnhh2tv" element={<AdminLogin />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

// Component hiển thị Header dựa trên đường dẫn hiện tại
function ConditionalHeader() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" &&
        location.pathname !== "/registration" && <Header /> &&
        location.pathname !== "/tnhh2tv" && <Header /> &&
        location.pathname !== "/AdminDashboard" && <Header />}
    </>
  );
}

export default App;
