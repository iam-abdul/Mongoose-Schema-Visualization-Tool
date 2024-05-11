import { Handle, Position } from "reactflow";
import classes from "./custom.module.css";
import PropTypes from "prop-types";

// const handleStyle = { left: 10 };
// function displaySchema(schema, key = "") {
//   return (
//     <div>
//       {Object.entries(schema).map(([k, v]) => {
//         const newKey = key ? `${key}.${k}` : k;
//         if (typeof v === "object" && v !== null && !Array.isArray(v)) {
//           return displaySchema(v, newKey);
//         } else {
//           return <div key={newKey}>{`${newKey}: ${JSON.stringify(v)}`}</div>;
//         }
//       })}
//     </div>
//   );
// }

// i have to handle sub documents
// array of sub documents
// sub document containing references
const getValue = (value, depth) => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    if (value.type && value.type.toLowerCase() === "string") {
      if (value.required) {
        return (
          <span>
            <span style={{ color: "red" }}>*</span>
            String
          </span>
        );
      } else {
        return <span>String</span>;
      }
    } else if (
      value.type &&
      value.type.toLowerCase() === "schema.types.objectid"
    ) {
      if (value.required) {
        return (
          <span style={{ position: "relative" }}>
            <span style={{ color: "red" }}>*</span>
            {value.ref} (Id)
            <Handle
              style={{ left: "101%" }}
              type="source"
              position={Position.Right}
            />
          </span>
        );
      } else {
        return (
          <span>
            <span>{value.ref} (Id)</span>
            <Handle type="source" position={Position.Right} />
          </span>
        );
      }
    }

    // return displaySchema(value);
  } else if (Array.isArray(value)) {
    return <span>[ ] {getValue(value[0])}</span>;
  }

  return DisplaySchema(value, depth);
};

// shades of grey
const colors = ["transparent", "#272727", "#202020", "#d0d0d0", "#c0c0c0"];

const DisplaySchema = (schema, depth) => {
  const color = colors[depth];
  return (
    <div style={{ backgroundColor: color }}>
      {Object.entries(schema).map(([key, value]) => {
        return (
          <div className={classes.contents} key={key}>
            <span className={classes.keys}>{key}: </span>
            <span className={classes.values}>{getValue(value, depth + 1)}</span>
          </div>
        );
      })}
    </div>
  );
};

function TextUpdaterNode({ data }) {
  console.log("data in TextUpdaterNode: ", data);
  return (
    <div>
      <div className={classes.card}>
        <div className={classes.name}>
          <h3>{data.model}</h3>
        </div>
        <div className={classes.schema}>{DisplaySchema(data.schema, 0)}</div>
      </div>
    </div>
  );
}
export default TextUpdaterNode;

TextUpdaterNode.propTypes = {
  data: PropTypes.object.isRequired,
};
