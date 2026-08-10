import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, MiniMap, Controls, Background, useReactFlow } from 'reactflow';

import 'reactflow/dist/style.css';

import NoteWidget from '../NoteWidget';
import EditorWidget from '../EditorWidget';
import MinimizedWidgetsBar from './MinimizedWidgetsBar';

const nodeTypes = {
  noteWidget: NoteWidget,
  editorWidget: EditorWidget,
};

const edgeTypes = {
  // You can define custom edge types here if needed
  // default: CustomEdgeComponent,
};

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Welcome to TLang Canvas!' }, type: 'noteWidget' },
];
const initialEdges = [];

function Canvas({ onCanvasMove }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) =>
      applyNodeChanges(changes, nds).map((node) => {
        if (node.selected) {
          return { ...node, style: { ...node.style, zIndex: 1000 } };
        }
        return { ...node, style: { ...node.style, zIndex: 1 } };
      })
    ),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${crypto.randomUUID()}`,
        type,
        position,
        data: { label: `${type} node` },
        style: { width: 300, height: 200 }, // Standard size for new widgets
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  const handleMove = useCallback((event, transform) => {
    if (onCanvasMove) {
      onCanvasMove(transform);
    }
  }, [onCanvasMove]);

  const onMinimize = useCallback((id) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const newIsMinimized = !node.data.isMinimized;
          const newPosition = newIsMinimized ? { x: -1000, y: -1000 } : node.data.lastPosition || node.position; // Move off-screen when minimized
          return {
            ...node,
            data: { ...node.data, isMinimized: newIsMinimized, lastPosition: node.position },
            position: newPosition,
            style: { ...node.style, height: newIsMinimized ? 40 : 200 },
          };
        }
        return node;
      })
    );
  }, []);

  const onUnminimize = useCallback((id) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, isMinimized: false },
            position: node.data.lastPosition || node.position, // Restore to last position
            style: { ...node.style, height: 200 },
          };
        }
        return node;
      })
    );
  }, []);

  const onDestroy = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, []);

  const customNodeTypes = React.useMemo(() => Object.keys(nodeTypes).reduce((acc, key) => {
    acc[key] = (props) => React.createElement(nodeTypes[key], { ...props, onMinimize, onDestroy });
    return acc;
  }, {}), [onMinimize, onDestroy]);

  const activeNodes = nodes.filter(node => !node.data.isMinimized);
  const minimizedNodes = nodes.filter(node => node.data.isMinimized);

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={activeNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMove={handleMove}
        fitView
        nodeTypes={customNodeTypes}
        edgeTypes={edgeTypes}
        panOnDrag={true}
        nodeDragHandle=".draghandle"
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <MinimizedWidgetsBar minimizedNodes={minimizedNodes} onUnminimize={onUnminimize} />
    </div>
  );
}

export default Canvas;

