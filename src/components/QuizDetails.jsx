import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import BackgroundWrapper from './BackgroundWrapper';

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

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <BackgroundWrapper>
      <NavigationBar />
      <div className="flex justify-center p-4 text-white">
        <div className="w-full max-w-md p-4 bg-black bg-opacity-95 shadow rounded-lg cursor-pointer">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-poppins font-bold text-shadow-lg">{quizTitle}</h2>
            <button 
              className="px-4 py-2 bg-pink-600 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
          <p className="text-md font-poppins">{quizDescription}</p>
          <button 
            className="mt-4 px-4 py-2 bg-purple-600 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
            onClick={handleStartClick}
          >
            Start
          </button>
          {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default QuizDetails;