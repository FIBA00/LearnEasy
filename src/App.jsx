import React, { useCallback, useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';

import Canvas from './components/Canvas';
import ToolPalette from './components/ToolPalette';
import TopBar from './components/TopBar';

function AppContent() {
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, zoom: 1 });

  const handleCanvasMove = useCallback((transform) => {
    setCanvasTransform(transform);
  }, []);

  useEffect(() => {
    // Adjust background position based on canvas transform for warping effect
    const body = document.body;
    if (body) {
      const parallaxFactor = 0.1; // Adjust this for more or less parallax
      const bgPosX = -canvasTransform.x * parallaxFactor;
      const bgPosY = -canvasTransform.y * parallaxFactor;
      body.style.backgroundPosition = 
        `${bgPosX}px ${bgPosY}px, ` +
        `${bgPosX + 40}px ${bgPosY + 60}px, ` +
        `${bgPosX + 130}px ${bgPosY + 270}px, ` +
        `${bgPosX + 70}px ${bgPosY + 100}px`;
    }
  }, [canvasTransform]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <ToolPalette />
        <Canvas onCanvasMove={handleCanvasMove} />
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <AppContent />
  </ReactFlowProvider>
);
