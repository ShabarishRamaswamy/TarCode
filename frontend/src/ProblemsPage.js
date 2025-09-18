// src/ProblemsPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './ProblemsPage.css';

const API_BASE = 'http://localhost:8001/api';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [formData, setFormData] = useState({ statement: '', testCases: [] });
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const [dividerPosition, setDividerPosition] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Handle editor resizing
  const handleEditorResize = useCallback(() => {
    if (editorRef.current) {
      // Use a small timeout to ensure the DOM has settled after the drag
      setTimeout(() => editorRef.current.layout(), 0);
    }
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleWindowResize = () => {
      handleEditorResize();
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleEditorResize]);

  // Fetch problems
  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/problems`);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setFormData({ statement: problem.statement, testCases: problem.testCases || [] });
  };

  const handleAddProblem = () => {
    setSelectedProblem(null);
    setFormData({ statement: '', testCases: [] });
  };

  const handleDeleteProblem = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await axios.delete(`${API_BASE}/problems/${id}`);
        fetchProblems();
        if (selectedProblem?.id === id) {
          setSelectedProblem(null);
          setFormData({ statement: '', testCases: [] });
        }
      } catch (error) {
        console.error('Error deleting problem:', error);
      }
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expected: '' }],
    });
  };

  const updateTestCase = (index, field, value) => {
    const updated = formData.testCases.map((tc, i) =>
      i === index ? { ...tc, [field]: value } : tc
    );
    setFormData({ ...formData, testCases: updated });
  };

  const saveProblem = async () => {
    const payload = { ...formData, testCases: formData.testCases.filter((tc) => tc.input || tc.expected) };
    try {
      if (selectedProblem) {
        await axios.put(`${API_BASE}/problems/${selectedProblem.id}`, payload);
      } else {
        await axios.post(`${API_BASE}/problems`, payload);
      }
      fetchProblems();
      setSelectedProblem(null);
    } catch (error) {
      console.error('Error saving problem:', error);
    }
  };

  const runCode = async () => {
    if (!formData.testCases.length) {
      alert('Add at least one test case!');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const response = await axios.post(`${API_BASE}/execute`, {
        code,
        tests: formData.testCases,
      });
      setResults(response.data);
    } catch (error) {
      setResults({ error: error.response?.data?.message || 'Execution failed' });
    } finally {
      setLoading(false);
    }
  };

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
      // Trigger a resize only after dragging is complete
      handleEditorResize();
    }
  }, [isDragging, handleEditorResize]);

  return (
    <div
      className="problems-page"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="left-panel" style={{ width: `${dividerPosition}%` }}>
        <div className="problem-list">
          <h2>Problems</h2>
          <button onClick={handleAddProblem} className="add-btn">+ Add Problem</button>
          <ul>
            {problems.map((problem) => (
              <li key={problem.id} className="problem-item">
                <div onClick={() => handleSelectProblem(problem)}>
                  <strong>{problem.title || 'Untitled'}</strong>
                  <p>{problem.statement.substring(0, 100)}...</p>
                </div>
                <button onClick={() => handleDeleteProblem(problem.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        {/* The form logic remains the same */}
        {(selectedProblem || !selectedProblem) && (
          <div className="problem-form">
            <h3>{selectedProblem ? 'Edit Problem' : 'New Problem'}</h3>
            <textarea
              name="statement"
              placeholder="Enter problem statement..."
              value={formData.statement}
              onChange={handleFormChange}
              rows={5}
            />
            <h4>Test Cases</h4>
            {formData.testCases.map((tc, index) => (
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
            <button onClick={saveProblem}>Save</button>
          </div>
        )}
      </div>
      <div
        className="divider"
        onMouseDown={handleMouseDown}
        style={{ left: `${dividerPosition}%` }}
      ></div>
      <div className="right-panel" style={{ width: `${100 - dividerPosition}%` }}>
        <div className="code-editor">
          <h3>Code Editor</h3>
          <Editor
            height="60vh"
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
                    <strong>Test {index + 1}:</strong> Input: {formData.testCases[index].input}<br />
                    Output: {result.output}<br />
                    Expected: {formData.testCases[index].expected}<br />
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