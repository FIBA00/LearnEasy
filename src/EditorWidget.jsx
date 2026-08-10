import React, { useState, useEffect, useCallback } from 'react';
import WidgetWrapper from './components/WidgetWrapper';

const EditorWidget = ({ id, selected, data, onMinimize, onDestroy }) => {
  const [codeContent, setCodeContent] = useState(data.initialContent || '// Write your code here...');
  const [filename, setFilename] = useState(data.filename || 'untitled.js');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/code/list');
      const result = await response.json();
      if (response.ok) {
        setFileList(result.files);
      } else {
        console.error('Error fetching file list:', result.error);
      }
    } catch (error) {
      console.error('Network error fetching file list:', error);
    }
  };

  const handleEditorChange = useCallback((e) => {
    setCodeContent(e.target.value);
  }, []);

  const saveFile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/code/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, content: codeContent }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        fetchFileList(); // Refresh file list after saving
      } else {
        alert(`Error saving file: ${result.error}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    }
  };

  const loadFile = async (selectedFilename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/code/load/${selectedFilename}`);
      const result = await response.json();
      if (response.ok) {
        setCodeContent(result.content);
        setFilename(result.filename);
        alert('File loaded successfully!');
      } else {
        alert(`Error loading file: ${result.error}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    }
  };

  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.value;
    if (selectedFile) {
      loadFile(selectedFile);
    }
  };

  const newFile = () => {
    setFilename('untitled.js');
    setCodeContent('// New file...');
  };

  return (
    <WidgetWrapper id={id} title="Code Editor" selected={selected} onMinimize={onMinimize} onDestroy={onDestroy}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          value={filename}
          onChange={handleFilenameChange}
          placeholder="Filename"
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', background: '#333', color: '#e0e0e0' }}
        />
        <button onClick={newFile} style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', background: '#e0e0e0', cursor: 'pointer', color: '#20232a', marginRight: '5px' }}>
          New
        </button>
        <button onClick={saveFile} style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', background: '#e0e0e0', cursor: 'pointer', color: '#20232a', marginRight: '5px' }}>
          Save
        </button>
        <select onChange={handleFileSelect} value="" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', background: '#333', color: '#e0e0e0' }}>
          <option value="">Load File...</option>
          {fileList.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={codeContent}
        onChange={handleEditorChange}
        style={{
          width: '100%',
          flex: 1,
          border: '1px solid #eee',
          borderRadius: '4px',
          padding: '8px',
          resize: 'none',
          fontFamily: 'monospace',
          fontSize: '14px',
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
        }}
      ></textarea>
    </WidgetWrapper>
  );
};

export default EditorWidget;
