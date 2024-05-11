import "./App.css";
import Visualize from "./pages/Visualize/Visualize";
import FileUpload from "./pages/FileUpload/UploadFile";
import { useState } from "react";

function App() {
  const [models, setModels] = useState([]);

  console.log("from app js", models);
  return (
    <>
      {/* <FileUpload setModels={setModels} /> */}
      <Visualize models={models} />
    </>
  );
}

export default App;
