import React, { useState, useCallback, useEffect } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import WidgetWrapper from './components/WidgetWrapper';

const NoteWidget = ({ id, selected, data, onMinimize, onDestroy }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [noteContent, setNoteContent] = useState(data.initialContent || '');
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    fetchNoteList();
  }, []);

  const fetchNoteList = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes/list');
      const result = await response.json();
      if (response.ok) {
        setNoteList(result.notes);
      } else {
        console.error('Error fetching note list:', result.error);
      }
    } catch (error) {
      console.error('Network error fetching note list:', error);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleContentChange = useCallback((content) => {
    setNoteContent(content);
  }, []);

  const saveNote = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes/save_note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, content: noteContent }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        fetchNoteList(); // Refresh list after saving
      } else {
        alert(`Error saving note: ${result.error}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    }
  };

  const loadNote = async (noteIdToLoad) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/load_note/${noteIdToLoad}`);
      const result = await response.json();
      if (response.ok) {
        setNoteContent(result.content);
        alert('Note loaded successfully!');
      } else {
        alert(`Error loading note: ${result.error}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    }
  };

  const handleNoteSelect = (e) => {
    const selectedNoteId = e.target.value;
    if (selectedNoteId) {
      loadNote(selectedNoteId);
    }
  };

  return (
    <WidgetWrapper id={id} title="Notes" selected={selected} onMinimize={onMinimize} onDestroy={onDestroy}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button onClick={togglePreview} style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', background: '#e0e0e0', cursor: 'pointer', color: '#20232a' }}>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button onClick={saveNote} style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', background: '#e0e0e0', cursor: 'pointer', color: '#20232a' }}>
          Save
        </button>
        <select onChange={handleNoteSelect} value="" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', background: '#333', color: '#e0e0e0' }}>
          <option value="">Load Note...</option>
          {noteList.map((noteId) => (
            <option key={noteId} value={noteId}>
              {noteId}
            </option>
          ))}
        </select>
      </div>
      <MarkdownEditor initialContent={noteContent} onContentChange={handleContentChange} showPreview={showPreview} />
    </WidgetWrapper>
  );
};

export default NoteWidget;
