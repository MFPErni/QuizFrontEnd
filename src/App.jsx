// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Home from './components/Home';
import Profile from './components/Profile';
import Categories from './components/Categories';
import HowToPlay from './components/HowToPlay';
import About from './components/About';
import Contact from './components/Contact';
import QuizDetails from './components/QuizDetails';
import QuizStart from './components/QuizStart';
import CreateAQuiz from './components/CreateAQuiz';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz/:quizId" element={<QuizDetails />} />
          <Route path="/quiz-start/:quizId" element={<QuizStart />} />
          <Route path="/create-a-quiz" element={<CreateAQuiz />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;