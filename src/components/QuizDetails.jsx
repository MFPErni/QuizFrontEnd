// src/components/QuizDetails.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Add this import statement
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';

const QuizDetails = () => {
  useAuthRedirect();

  const location = useLocation();
  const navigate = useNavigate();
  const { quizID, quizTitle, quizDescription, quizCategoryTitle } = location.state;
  const [message, setMessage] = useState('');

  const handleStartClick = async () => {
    try {
      const response = await axios.get(`/question/questions-by-quiz/${quizID}`);
      const questions = response.data;

      if (questions.length === 0) {
        setMessage('There are currently no questions for this quiz. Try again later!');
      } else {
        console.log('Quiz ID:', quizID);
        console.log('Quiz Title:', quizTitle);
        console.log('Quiz Description:', quizDescription);
        console.log('Quiz Category Title:', quizCategoryTitle);
        navigate(`/quiz-start/${quizID}`, {
          state: {
            quizID,
            quizTitle,
            quizDescription,
            quizCategoryTitle
          }
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage('There is currently no questions for this quiz. Please try again later.');
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h2 className="text-xl font-bold">{quizTitle}</h2>
        <p className="text-md">{quizDescription}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleStartClick}
        >
          Start
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default QuizDetails;