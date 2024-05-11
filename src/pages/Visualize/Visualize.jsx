import { useCallback, useEffect, useMemo } from "react";
import TextUpdaterNode from "./CustomNode";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import PropTypes from "prop-types";
import "reactflow/dist/style.css";

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
//   { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
// ];
// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function Visualize({ models }) {
  const initialNodes = models.map((model, index) => ({
    id: model.model.toLowerCase(),
    position: { x: 0, y: 100 * index },
    data: {
      model: model.model,
      schema: { _id: { type: "ObjectId", required: true }, ...model.schema },
    },
    type: "textUpdater",
  }));

  // console.log("initialNodes in Visualize: ", initialNodes);

  // const initialNodes = [
  //   {
  //     id: "1",
  //     position: { x: 0, y: 0 },
  //     data: {
  //       model: "Post",
  //       jsSchemaName: "postSchema",
  //       nodeId: 3,
  //       schema: {
  //         content: { type: "string", required: true },
  //         user: {
  //           type: "Schema.Types.ObjectId",
  //           ref: "User",
  //           required: true,
  //         },
  //         tags: [{ type: "Schema.Types.ObjectId", ref: "Tag", required: true }],
  //         mentions: [{ type: "string" }],
  //         metaData: [
  //           {
  //             device: {
  //               type: "String",
  //             },
  //             location: {
  //               country: {
  //                 type: "String",
  //               },
  //               city: [
  //                 {
  //                   type: "String",
  //                   required: true,
  //                 },
  //               ],
  //               pincode: {
  //                 type: "Schema.Types.ObjectId",
  //                 ref: "Tag",
  //                 required: true,
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     type: "textUpdater",
  //   },
  // ];

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const extractEdges = (schema, nestedKeyPath, modelName) => {
    const edges = [];
    console.log("came into extractEdges ", schema, nestedKeyPath, modelName);
    for (const key in schema) {
      if (schema[key] && schema[key].ref && !Array.isArray(schema[key])) {
        console.log("came into ref ", schema[key]);
        edges.push({
          id: `${nestedKeyPath}-${key}`.toLocaleLowerCase(),
          source: modelName.toLocaleLowerCase(),
          target: schema[key].ref.toLocaleLowerCase(),
          sourceHandle: `${nestedKeyPath}-${key}`.toLocaleLowerCase(),
          targetHandle: `${schema[key].ref}-_id`.toLocaleLowerCase(),
        });
      } else if (
        typeof schema[key] === "object" &&
        !Array.isArray(schema[key])
      ) {
        console.log("Came into object ", schema[key], nestedKeyPath);
        const nestedEdges = extractEdges(
          schema[key],
          `${nestedKeyPath}-${key}`,
          modelName
        );
        edges.push(...nestedEdges);
      } else if (Array.isArray(schema[key])) {
        console.log("Came into array ", schema[key][0], nestedKeyPath);

        const nestedEdges = extractEdges(
          { [key]: schema[key][0] },
          `${nestedKeyPath}`,
          modelName
        );
        console.log(
          "after array ",
          nestedEdges,
          schema[key][0],
          nestedKeyPath,
          modelName
        );
        edges.push(...nestedEdges);
      }
    }

    return edges;
  };

  useEffect(() => {
    setNodes(initialNodes);
    const initialEdges = models.map((model) =>
      extractEdges(model.schema, model.model, model.model)
    );

    const flatEdges = initialEdges.flat();

    setEdges([...flatEdges]);
    console.log("initialNodes: ", initialNodes);
    console.log("flatEdges: ", flatEdges);

    // setEdges([
    //   {
    //     id: "e1-2",
    //     source: "post",
    //     target: "user",
    //     sourceHandle: "post-user",
    //     targetHandle: "user-_id",
    //   },
    // ]);
    console.log("nodes in useEffect: ", initialNodes);
  }, [models]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        style={{ background: "#151515" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        {/* <MiniMap /> */}
        <Background color="#353535" variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

Visualize.propTypes = {
  models: PropTypes.array.isRequired,
};
