// src/ProblemsPage.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import './ProblemsPage.css';

const API_BASE = 'http://localhost:8001/api';

const ProblemsPage = () => {
  // State for a single problem
  const [problemStatement, setProblemStatement] = useState("**Problem Title**\n\nEnter your markdown-enabled problem description here.");
  const [markdownMode, setMarkdownMode] = useState('editor'); // 'editor' or 'preview'
  const [testCases, setTestCases] = useState([{ input: '', expected: '' }]);

  // State for code editor and results
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs and logic for the resizable layout
  const editorRef = useRef(null);
  const [dividerPosition, setDividerPosition] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorResize = useCallback(() => {
    if (editorRef.current) {
      setTimeout(() => editorRef.current.layout(), 0);
    }
  }, []);

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expected: '' }]);
  };

  const updateTestCase = (index, field, value) => {
    const updated = testCases.map((tc, i) =>
      i === index ? { ...tc, [field]: value } : tc
    );
    setTestCases(updated);
  };

  const saveProblem = async () => {
    const payload = {
      statement: problemStatement,
      testCases: testCases.filter((tc) => tc.input || tc.expected),
    };
    try {
      await axios.post(`${API_BASE}/problems`, payload);
      alert('Problem saved successfully!');
    } catch (error) {
      console.error('Error saving problem:', error);
      alert('Failed to save problem.');
    }
  };

  const runCode = async () => {
    if (!testCases.length || testCases.every(tc => !tc.input && !tc.expected)) {
      alert('Add at least one test case!');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const response = await axios.post(`${API_BASE}/submission/`, {
        code,
        tests: testCases,
      });
      setResults(response.data);
    } catch (error) {
      setResults({ error: error.response?.data?.message || 'Execution failed' });
    } finally {
      setLoading(false);
    }
  };

  // Dragging logic for the divider
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (!containerRect.width) return;
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const minWidth = 20;
    const maxWidth = 80;
    if (newPosition >= minWidth && newPosition <= maxWidth) {
      setDividerPosition(newPosition);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      handleEditorResize();
    }
  }, [isDragging, handleEditorResize]);

  useEffect(() => {
    window.addEventListener('resize', handleEditorResize);
    return () => {
      window.removeEventListener('resize', handleEditorResize);
    };
  }, [handleEditorResize]);


  return (
    <div
      className="problems-page"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="left-panel" style={{ width: `${dividerPosition}%` }}>
        <div className="problem-statement-section">
          <div className="section-header">
            <h3>Problem Statement</h3>
            <div className="view-toggle">
              <button onClick={() => setMarkdownMode('editor')} className={markdownMode === 'editor' ? 'active' : ''}>Editor</button>
              <button onClick={() => setMarkdownMode('preview')} className={markdownMode === 'preview' ? 'active' : ''}>Preview</button>
            </div>
          </div>
          <div className="markdown-container">
            {markdownMode === 'editor' ? (
              <Editor
                height="100%"
                language="markdown"
                value={problemStatement}
                onChange={setProblemStatement}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'none',
                }}
              />
            ) : (
              <div className="markdown-preview">
                <ReactMarkdown children={problemStatement} />
              </div>
            )}
          </div>
        </div>
        <div className="test-cases-section">
          <h3>Test Cases</h3>
          {testCases.map((tc, index) => (
            <div key={index} className="test-case">
              <input
                placeholder="Input (e.g., 1 2)"
                value={tc.input}
                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
              />
              <input
                placeholder="Expected Output (e.g., 3)"
                value={tc.expected}
                onChange={(e) => updateTestCase(index, 'expected', e.target.value)}
              />
            </div>
          ))}
          <button onClick={addTestCase}>+ Add Test Case</button>
          <button onClick={saveProblem} className="save-btn">Save</button>
        </div>
      </div>
      <div
        className="divider"
        onMouseDown={handleMouseDown}
        style={{ left: `${dividerPosition}%` }}
      ></div>
      <div className="right-panel" style={{ width: `${100 - dividerPosition}%` }}>
        <div className="code-editor">
          <h3>Code Editor</h3>
          <div className="editor-container">
            <Editor
              height="100%"
              language="c"
              value={code}
              onChange={setCode}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
                renderLineHighlight: 'none',
              }}
            />
          </div>
          <button onClick={runCode} disabled={loading}>
            {loading ? 'Running...' : 'Run'}
          </button>
        </div>
        <div className="results">
          <h3>Results</h3>
          {loading && <div className="spinner">Loading...</div>}
          {results && !results.error && (
            <div>
              <p>Time: {results.time}s</p>
              <ul>
                {results.results.map((result, index) => (
                  <li key={index} className={result.passed ? 'pass' : 'fail'}>
                    <strong>Test {index + 1}:</strong> Input: {testCases[index].input}<br />
                    Output: {result.output}<br />
                    Expected: {testCases[index].expected}<br />
                    Status: {result.passed ? 'Passed' : 'Failed'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results?.error && <div className="error">Error: {results.error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;