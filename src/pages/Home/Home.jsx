import FileUpload from "../FileUpload/UploadFile";
import PropTypes from "prop-types";
import classes from "./home.module.css";
import { SiMongoose } from "react-icons/si";
const Home = ({ setModels }) => {
  return (
    <div className={classes.parent}>
      <div className={classes.heading}>
        <SiMongoose color="red" size={50} />
        <h1>Mongoose Schema Visualization Tool</h1>
      </div>
      <FileUpload setModels={setModels} />
    </div>
  );
};

Home.propTypes = {
  setModels: PropTypes.func.isRequired,
};

export default Home;
