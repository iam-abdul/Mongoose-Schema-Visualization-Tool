import { useCallback, useState } from "react";
import classes from "./uploadFile.module.css";
import { useDropzone } from "react-dropzone";
import extractModel from "mongoose-parser";

import { SiJavascript } from "react-icons/si";

import PropTypes from "prop-types";

const FileUpload = ({ setModels }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      // skip if it is not a js file
      if (!file.path.endsWith(".js")) {
        return;
      }
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;

        setModels((prev) => {
          const model = extractModel(binaryStr);
          return [...prev, ...model];
        });
      };
      reader.readAsText(file);
    });
    setFiles(acceptedFiles);
    // concat all the content of the files
  }, []);
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`${classes.fileUpload} ${
          files.length > 0 ? classes.minimize : ""
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      <ul className={classes.filesList}>
        {files.map((file) => (
          <li key={file.path}>
            <SiJavascript size={"1.3rem"} color="yellow" />
            <span>{file.path}</span>
            {/* <MdOutlineClose
              //   onClick={() => {
              //     setFiles(files.filter((f) => f.path !== file.path));
              //     setModels((prev) => prev.filter((m) => m.path !== file.path));
              //   }}
              style={{ cursor: "pointer" }}
            /> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

FileUpload.propTypes = {
  setModels: PropTypes.func.isRequired,
};

export default FileUpload;
