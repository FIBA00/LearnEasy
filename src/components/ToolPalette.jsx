import React, { useState } from 'react';

const ToolPalette = () => {
  const [hoveredTool, setHoveredTool] = useState(null);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const ToolItem = ({ type, label, icon }) => (
    <div
      style={{
        position: 'relative',
        width: '50px',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '10px',
        cursor: 'grab',
        backgroundColor: '#444',
        fontSize: '24px',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHoveredTool(type)}
      onMouseLeave={() => setHoveredTool(null)}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {icon || label.charAt(0)}
      {hoveredTool === type && (
        <span
          style={{
            position: 'absolute',
            left: '60px',
            backgroundColor: '#333',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  return (
    <aside style={{
      width: '70px', // Narrow width for icons
      padding: '10px',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(32, 35, 42, 0.7)',
      color: '#e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h3 style={{ marginBottom: '20px' }}>Tools</h3>
      <ToolItem type="noteWidget" label="Note Widget" icon="📝" />
      <ToolItem type="editorWidget" label="Editor Widget" icon="💻" />
    </aside>
  );
};

export default ToolPalette;
