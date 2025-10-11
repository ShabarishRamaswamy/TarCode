// src/ProblemsPage.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {ParseCodeAndReturnIO} from "./parseCode";
import axios from 'axios';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import './ProblemsPage.css';

// The proxy in package.json will handle routing this to the correct backend port in development.
const API_BASE = '/api';

const ProblemsPage = () => {
  // State for a single problem
  const [problemStatement, setProblemStatement] = useState('');
  const [markdownMode, setMarkdownMode] = useState('preview');
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

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // **Modified:** Updated the URL to fetch the template file.
        const response = await fetch('problems/problem-template.md');
        if (!response.ok) {
          throw new Error('Problem file not found');
        }
        const text = await response.text();
        setProblemStatement(text);
      } catch (error) {
        console.error('Failed to fetch problem statement:', error);
        setProblemStatement('**Error:** Could not load the problem statement.');
      }
    };

    fetchProblem();
  }, []); // Empty dependency array ensures this runs only once

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
    alert('Save functionality not yet implemented.');
  };

  const parseCode = () => {
    const [inputs, expectedOutputs] = ParseCodeAndReturnIO(code);
    // console.log("Parsed", inputs, expectedOutputs);

    // Ensure we have valid, matching arrays to work with
    if (!inputs || !expectedOutputs || inputs.length === 0 || inputs.length !== expectedOutputs.length) {
      alert("No valid test cases were found or parsed from the code.");
      return;
    }

    // Map the parsed arrays to the format required by the state
    const newTestCases = inputs.map((inputValue, index) => ({
      input: inputValue,
      expected: expectedOutputs[index],
    }));

    // Update the state to re-render the UI with the new test cases
    setTestCases(newTestCases);
  };

  const runCode = async () => {
    if (!testCases.length || testCases.every(tc => !tc.input && !tc.expected)) {
      alert('Add at least one test case!');
      return;
    }
    setLoading(true);
    setResults(null);

    const payload = {
      lang: "c",
      code: code,
      test_cases: testCases.map(tc => ({ input: tc.input, output: tc.expected }))
    };

    try {
      const response = await axios.post(`${API_BASE}/submission/123`, payload);
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Execution failed on the server.';
      setResults([{ error: errorMessage }]);
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
              <button onClick={() => setMarkdownMode('preview')} className={markdownMode === 'preview' ? 'active' : ''}>Preview</button>
              <button onClick={() => setMarkdownMode('editor')} className={markdownMode === 'editor' ? 'active' : ''}>Editor</button>
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
                placeholder="Input"
                value={tc.input}
                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
              />
              <input
                placeholder="Expected Output"
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
          <div className="section-header">
            <h3>Code Editor</h3>
            <button onClick={parseCode} className="parse-btn">Parse</button>
          </div>
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
          
          {!loading && results && (
            <div className="results-list">
              {results[0]?.error ? (
                <div className="error">Error: {results[0].error}</div>
              ) : (
                results.map((item, index) => (
                  <div key={index} className={`result-item ${item.result ? 'pass' : 'fail'}`}>
                    <div className="result-header">
                      <strong>Test Case {index + 1}</strong>
                      <strong className={`status ${item.result ? 'pass' : 'fail'}`}>
                        {item.result ? 'Passed' : 'Failed'}
                      </strong>
                    </div>
                    <div className="result-body">
                      <div>
                        <label>Test Case Input</label>
                        <pre>{item.test_case.input || ' '}</pre>
                      </div>
                      <div>
                        <label>Expected Output</label>
                        <pre>{item.test_case.output || ' '}</pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;