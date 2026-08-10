import React from 'react';
import { NodeResizer } from 'reactflow';

const WidgetWrapper = ({ id, children, title, selected, onMinimize, onDestroy, isMinimized }) => {
  return (
    <div style={{
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backgroundColor: 'rgba(32, 35, 42, 0.7)',
      color: '#e0e0e0',
      height: isMinimized ? '40px' : '100%', // Fixed height when minimized
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <NodeResizer minWidth={100} minHeight={isMinimized ? 40 : 50} isVisible={selected} style={{ border: '1px solid red' }} />
      <div className="draghandle" style={{
        padding: '5px 10px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        cursor: 'grab', // Indicate draggable area
      }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={(e) => { e.stopPropagation(); onMinimize(id); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2em' }}>{isMinimized ? '➕' : '➖'}</button>
          <button onClick={(e) => { e.stopPropagation(); onDestroy(id); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2em' }}>✖️</button>
        </div>
      </div>
      {!isMinimized && (
        <div style={{ flexGrow: 1, padding: '10px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default WidgetWrapper;
