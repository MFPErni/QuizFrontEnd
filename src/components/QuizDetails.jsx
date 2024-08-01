import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar'; // Import NavigationBar

const QuizDetails = () => {
  const { quizTitle } = useParams();
  const location = useLocation();
  const { description } = location.state || {};

  return (
    <div>
      <NavigationBar /> {/* Add NavigationBar here */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">{quizTitle}</h1>
        {description && <p className="mt-4">{description}</p>}
        {/* Add more details about the quiz here */}
      </div>
    </div>
  );
};

export default QuizDetails;