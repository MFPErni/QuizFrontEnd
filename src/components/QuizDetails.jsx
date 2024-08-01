import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';

const QuizDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizID, quizTitle, quizDescription, quizCategoryTitle } = location.state;

  const handleStartClick = () => {
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
      </div>
    </div>
  );
};

export default QuizDetails;