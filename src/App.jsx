import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TemplateForm from './pages/TemplateForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/template/:id" element={<TemplateForm />} />
      </Routes>
    </Router>
  );
}

export default App;
