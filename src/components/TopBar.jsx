import React from 'react';

const TopBar = () => {
  return (
    <div style={{
      background: 'rgba(32, 35, 42, 0.7)',
      padding: '1rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h1 style={{ margin: 0 }}>TLang</h1>
    </div>
  );
};

export default TopBar;
