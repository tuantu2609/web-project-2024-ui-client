import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import LearningPages from "./pages/LearningPages";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LearningPages />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;