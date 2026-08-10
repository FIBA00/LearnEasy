import React from 'react';

const MinimizedWidgetsBar = ({ minimizedNodes, onUnminimize }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1001, // Ensure it's above other elements
      display: 'flex',
      flexDirection: 'row',
      gap: '5px',
      padding: '10px',
      backgroundColor: 'rgba(32, 35, 42, 0.8)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      {minimizedNodes.length === 0 ? (
        <span style={{ color: '#e0e0e0' }}>No minimized widgets</span>
      ) : (
        minimizedNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => onUnminimize(node.id)}
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              background: '#e0e0e0',
              cursor: 'pointer',
              color: '#20232a',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2em',
              fontWeight: 'bold',
            }}
          >
            {node.type.charAt(0).toUpperCase()}
          </button>
        ))
      )}
    </div>
  );
};

export default MinimizedWidgetsBar;
