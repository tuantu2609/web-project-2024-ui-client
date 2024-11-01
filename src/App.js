import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import LearningPages from "./pages/LearningPages";
import Registration from "./pages/Registration";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LearningPages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
