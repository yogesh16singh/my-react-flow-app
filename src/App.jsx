import React, { useState, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'a' } },
  { id: '2', position: { x: 20, y: 200 }, data: { label: 'b' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const NodeOptions = ({ label, onUpdate, onDelete }) => {
  const [newLabel, setNewLabel] = useState(label);

  const handleUpdate = () => {
    onUpdate(newLabel);
  };

  return (
    <div style={{ position: 'absolute', right: '20px', top: '100px', background: '#b2bbcc', padding: '20px', border: '2px solid #383436', borderRadius: '20px', zIndex: '999' }}>
      <div style={{ marginBottom: '10px', fontSize: '20px', color: '#333' }}>Title : {label}</div>
      <input style={{ marginBottom: '10px', width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }} type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
      <button style={{ marginRight: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }} onClick={handleUpdate}>Update</button>
      <button style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }} onClick={onDelete}>Delete</button>
    </div>
  );
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const createNode = () => {
    const newNodeId = (nodes.length + 1).toString(); // Generate unique ID for the new node
    const newNode = {
      id: newNodeId,
      position: { x: 100, y: 100 }, // Set initial position for the new node
      data: { label: newNodeId }, // You can customize label or other data as needed
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const deleteSelectedNode = () => {
    if (selectedNodeId) {
      const updatedNodes = nodes.filter(node => node.id !== selectedNodeId);
      setNodes(updatedNodes);
      const updatedEdges = edges.filter(edge => edge.source !== selectedNodeId && edge.target !== selectedNodeId);
      setEdges(updatedEdges);
      setSelectedNodeId(null); // Reset selectedNodeId after deletion
    }
  };

  const updateSelectedNodeLabel = (newLabel) => {
    if (selectedNodeId) {
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel
            }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };

  const onNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
    setNodePosition({ x: event.clientX, y: event.clientY });
  };

  const selectedNodeLabel = selectedNodeId ? nodes.find(node => node.id === selectedNodeId)?.data.label : '';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        style={{ width: '100%', height: '100%' }}
      />
      {selectedNodeId && (
        <NodeOptions
          label={selectedNodeLabel}
          onUpdate={updateSelectedNodeLabel}
          onDelete={deleteSelectedNode}
        />
      )}
      <button style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 999, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }} onClick={createNode}>Create Node</button>
    </div>
  );
}
