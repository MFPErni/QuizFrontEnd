import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import Profile from './components/Profile';
import Categories from './components/Categories';
import HowToPlay from './components/HowToPlay';
import About from './components/About';
import Contact from './components/Contact';
import QuizDetails from './components/QuizDetails'; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quiz/:quizTitle" element={<QuizDetails />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;