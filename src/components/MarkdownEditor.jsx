import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownEditor = ({ initialContent = '', onContentChange, showPreview = true }) => {
  const [markdown, setMarkdown] = useState(initialContent);

  const handleEditorChange = (e) => {
    setMarkdown(e.target.value);
    if (onContentChange) {
      onContentChange(e.target.value);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <textarea
        id="markdown-editor-textarea"
        value={markdown}
        onChange={handleEditorChange}
        style={{
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          marginRight: showPreview ? '10px' : '0',
          resize: 'none',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
        placeholder="Write your markdown here..."
      />
      {showPreview && (
        <div
          style={{
            flex: 1,
            border: '1px solid #eee',
            borderRadius: '4px',
            padding: '10px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;

