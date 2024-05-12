import { useCallback, useEffect, useMemo } from "react";
import TextUpdaterNode from "./CustomNode";
import classes from "./visualize.module.css";
import Dagre from "@dagrejs/dagre";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import PropTypes from "prop-types";
import "reactflow/dist/style.css";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

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

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const extractEdges = (schema, nestedKeyPath, modelName) => {
    const edges = [];
    // console.log("came into extractEdges ", schema, nestedKeyPath, modelName);
    for (const key in schema) {
      if (schema[key] && schema[key].ref && !Array.isArray(schema[key])) {
        // console.log("came into ref ", schema[key]);
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
        // console.log("Came into object ", schema[key], nestedKeyPath);
        const nestedEdges = extractEdges(
          schema[key],
          `${nestedKeyPath}-${key}`,
          modelName
        );
        edges.push(...nestedEdges);
      } else if (Array.isArray(schema[key])) {
        // console.log("Came into array ", schema[key][0], nestedKeyPath);

        const nestedEdges = extractEdges(
          { [key]: schema[key][0] },
          `${nestedKeyPath}`,
          modelName
        );
        edges.push(...nestedEdges);
      }
    }

    return edges;
  };

  useEffect(() => {
    const initialEdges = models.map((model) =>
      extractEdges(model.schema, model.model, model.model)
    );

    const flatEdges = initialEdges.flat();

    setNodes(initialNodes);
    setEdges([...flatEdges]);

    // setTimeout(() => {
    //   setNodes((pNodes) => {
    //     const layouted = getLayoutedElements(pNodes, flatEdges, {
    //       direction: "TB",
    //     });
    //     return [...layouted.nodes];
    //   });

    //   setEdges((pEdges) => {
    //     const layouted = getLayoutedElements(nodes, pEdges, {
    //       direction: "TB",
    //     });
    //     return [...layouted.edges];
    //   });
    // }, 200);
  }, [models]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [nodes, edges]
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        style={{ background: "#151515" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls style={{ bottom: "0" }} />
        <Background color="#353535" variant="dots" gap={12} size={1} />
      </ReactFlow>
      {nodes.length > 0 ? (
        <div className={classes.layoutButtons}>
          <button onClick={() => onLayout("TB")}>Top-Bottom</button>
          <button onClick={() => onLayout("LR")}>Left-Right</button>
          <button onClick={() => onLayout("RL")}>Right-Left</button>
          <button onClick={() => onLayout("BT")}>Bottom-Top</button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

Visualize.propTypes = {
  models: PropTypes.array.isRequired,
};
