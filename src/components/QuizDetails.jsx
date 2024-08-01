import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar'; // Import NavigationBar

const QuizDetails = () => {
  const { quizTitle } = useParams();
  const { description } = useLocation().state || {};
  const navigate = useNavigate();

  const handleStartClick = async () => {
    console.log(`Quiz Title: ${quizTitle}`);
    try {
      const response = await axios.get(`/question/quiz/title/${encodeURIComponent(quizTitle)}`);
      console.log('Questions:', response.data);
      const questions = response.data || []; // Extract questions
      navigate('/questions', { state: { quizTitle, questions } }); // Navigate to the questions page
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">{quizTitle}</h1>
        {description && <p className="mt-4">{description}</p>}
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