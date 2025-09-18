import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProblemsPage from './ProblemsPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/" element={<ProblemsPage />} />
      </Routes>
    </div>
  );
}

export default App;