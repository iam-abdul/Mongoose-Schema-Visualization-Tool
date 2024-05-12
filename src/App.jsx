import "./App.css";
import Visualize from "./pages/Visualize/Visualize";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";

function App() {
  const [models, setModels] = useState([]);

  console.log("from app js", models);
  return (
    <Routes>
      <Route path="/" element={<Home setModels={setModels} />} />
      <Route path="/visualize" element={<Visualize models={models} />} />
    </Routes>
  );
}

export default App;
