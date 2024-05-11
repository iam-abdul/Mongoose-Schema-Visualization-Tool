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

// handle unique
// handle dates
const getValue = (value, depth, model, key) => {
  // console.log("value in getValue: ", value);
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
      value.type.toLowerCase().includes("schema.types.objectid")
    ) {
      if (value.required) {
        return (
          <span style={{ position: "relative" }}>
            <span style={{ color: "red" }}>*</span>
            {value.ref} (_Id)
            <Handle
              id={model + "-" + key}
              style={{ left: "101%" }}
              type="source"
              position={Position.Right}
            />
          </span>
        );
      } else {
        return (
          <span style={{ position: "relative" }}>
            <span>{value.ref} (_Id)</span>
            <Handle
              id={model + "-" + key}
              style={{ left: "101%" }}
              type="source"
              position={Position.Right}
            />
          </span>
        );
      }
    } else if (value.type && value.type.toLowerCase() === "objectid") {
      return (
        <span>
          <span>{value.type}</span>
        </span>
      );
    } else if (value.type && value.type.toLowerCase() === "number") {
      if (value.required) {
        return (
          <span>
            <span style={{ color: "red" }}>*</span>
            Number
          </span>
        );
      } else {
        return <span>Number</span>;
      }
    } else if (value.type && value.type.toLowerCase() === "boolean") {
      if (value.required) {
        return (
          <span>
            <span style={{ color: "red" }}>*</span>
            Boolean
          </span>
        );
      } else {
        return <span>Boolean</span>;
      }
    } else if (value.type && value.type.toLowerCase() === "date") {
      if (value.required) {
        return (
          <span>
            <span style={{ color: "red" }}>*</span>
            Date
          </span>
        );
      } else {
        return <span>Date</span>;
      }
    }
  } else if (Array.isArray(value)) {
    return (
      <span style={{ backgroundColor: colors[depth], display: "flex" }}>
        <span style={{ color: "#b0b0b0" }}> [ ] </span>{" "}
        {getValue(value[0], depth, model, key)}
      </span>
    );
  }

  return DisplaySchema(value, depth + 1, model + "-" + key);
};

// shades of grey
const colors = ["transparent", "#272727", "#202020", "#d0d0d0", "#c0c0c0"];

const DisplaySchema = (schema, depth, model) => {
  try {
    const color = colors[depth];
    return (
      <div style={{ backgroundColor: color }}>
        {Object.entries(schema).map(([key, value]) => {
          return (
            <div className={classes.contents} key={key}>
              <span className={classes.keys}>
                {key === "_id" ? (
                  <Handle
                    style={{ right: "130%", left: "-30%" }}
                    id={model + "-_id"}
                    type="target"
                    position={Position.Left}
                  />
                ) : (
                  ""
                )}{" "}
                {key}:{" "}
              </span>
              <span className={classes.values}>
                {getValue(value, depth, model, key)}
              </span>
            </div>
          );
        })}
      </div>
    );
  } catch (err) {
    console.error(
      err,
      `schema is: ${schema}
    depth is: ${depth}
    model is: ${model}
    `
    );
    return <div>error</div>;
  }
};

function TextUpdaterNode({ data }) {
  // console.log("data in TextUpdaterNode: ", data);
  return (
    <div>
      <div className={classes.card}>
        <div className={classes.name}>
          <h3>{data.model}</h3>
        </div>
        <div className={classes.schema}>
          {DisplaySchema(data.schema, 0, data.model.toLowerCase())}
        </div>
      </div>
    </div>
  );
}
export default TextUpdaterNode;

TextUpdaterNode.propTypes = {
  data: PropTypes.object.isRequired,
};
