import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Home from './components/Home';
import Categories from './components/Categories';
import QuizDetails from './components/QuizDetails';
import QuizStart from './components/QuizStart';
import SeeMyQuizzes from './components/SeeMyQuizzes';
import CreateQuiz from './components/CreateQuiz';
import EditQuiz from './components/EditQuiz'; // Import the EditQuiz component

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/quiz/:quizId" element={<QuizDetails />} />
          <Route path="/quiz-start/:quizId" element={<QuizStart />} />
          <Route path="/see-my-quizzes" element={<SeeMyQuizzes />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
          <Route path="/quiz-details/:quizId" element={<QuizDetails />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;