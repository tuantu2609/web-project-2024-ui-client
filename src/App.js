import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LearningPages from "./pages/LearningPages";
import LoginFrom from "./pages/test";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LearningPages />} />
          <Route path="/login" element={<LoginFrom />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
