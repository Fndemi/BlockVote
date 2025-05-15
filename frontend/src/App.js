// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/pages/AdminPanel';
import VoterPanel from './components/pages/VoterPanel';
import VotePanel from './components/pages/VotePanel';
import Layout from './components/Layout'; // Import the layout component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><VotePanel /></Layout>} />
        <Route path="/register" element={<Layout><VoterPanel /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
