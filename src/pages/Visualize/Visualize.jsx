import { useCallback, useMemo } from "react";
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
  // const initialNodes = models.map((model, index) => ({
  //   id: index.toString(),
  //   position: { x: 0, y: 100 * index },
  //   data: { label: model.model },
  //   type: "textUpdater",
  // }));

  console.log("models in Visualize: ", models);

  const initialNodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: {
        model: "Post",
        jsSchemaName: "postSchema",
        nodeId: 3,
        schema: {
          content: { type: "string", required: true },
          user: {
            type: "Schema.Types.ObjectId",
            ref: "User",
            required: true,
          },
        },
      },
      type: "textUpdater",
    },
  ];

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
