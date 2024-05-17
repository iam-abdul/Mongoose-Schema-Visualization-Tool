import { useCallback, useState } from "react";
import classes from "./uploadFile.module.css";
import { useDropzone } from "react-dropzone";
import extractModel from "mongoose-parser";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FileUpload = ({ setModels }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      // skip if it is not a js file
      let fileType = "";
      if (file.path.endsWith(".js")) {
        fileType = ".js";
      } else if (file.path.endsWith(".ts")) {
        fileType = ".ts";
      }

      if (!fileType) {
        return;
      }

      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;

        setModels((prev) => {
          const model = extractModel(binaryStr, fileType === ".ts");
          return [...prev, ...model];
        });
      };
      reader.readAsText(file);
    });
    navigate("/visualize");
    // concat all the content of the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const onSubmit = () => {
    setModels((prev) => {
      const model = extractModel(text);
      return [...prev, ...model];
    });
    setText("");
    navigate("/visualize");
  };

  return (
    <div className={classes.parent}>
      <div className={classes.text}>
        <div className={classes.textAreaContainer}>
          <textarea
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            placeholder="paste your code here"
            id=""
          ></textarea>
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
      <div className={classes.or}>or</div>
      <div {...getRootProps()} className={`${classes.fileUpload} `}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  setModels: PropTypes.func.isRequired,
};

export default FileUpload;
