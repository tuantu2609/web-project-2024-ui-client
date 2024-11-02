import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import LearningPages from "./pages/LearningPages";
import LoginFrom from "./pages/test";
import Registration from "./pages/Registration";
import HomePage from "./pages/HomePage";
import Header from "./pages/Header";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LearningPages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/header" element={<Header />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
