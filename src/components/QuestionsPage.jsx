import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axios/axiosconfig'; // Import axios instance
import NavigationBar from './NavigationBar'; // Import NavigationBar

const QuestionsPage = () => {
  const location = useLocation();
  const { quizTitle, questions } = location.state || {};

  // Extract the $values array from questions
  const questionTexts = questions?.$values || [];

  // State to store answers for each question
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchAnswers = async () => {
      const answersMap = {};
      for (const questionText of questionTexts) {
        try {
          const response = await axios.get(`/answer/question/${encodeURIComponent(questionText)}`);
          const answerTexts = response.data.$values || [];
          answersMap[questionText] = answerTexts;
        } catch (error) {
          console.error(`Error fetching answers for question "${questionText}":`, error);
        }
      }
      setAnswers(answersMap);
    };

    fetchAnswers();
  }, [questionTexts]);

  const handleButtonClick = () => {
    console.log('Quiz Title:', quizTitle);
    console.log('Questions:', questionTexts);
    console.log('Answers:', answers);
  };

  const handleCardClick = (answerText) => {
    console.log('Answer Text:', answerText);
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">{quizTitle}</h1>
        <div className="mt-4">
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleButtonClick}
          >
            Log Quiz Info
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {questionTexts.map((question, index) => (
            <div
              key={index}
              className="p-4 border rounded shadow cursor-pointer" // Add cursor-pointer for better UX
            >
              <p className="text-lg font-bold">{`Question ${index + 1}`}</p>
              <p>{question}</p>
              {answers[question] && (
                <div className="mt-2 space-y-2">
                  {answers[question].map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className="p-2 border rounded"
                      onClick={() => handleCardClick(answer)} // Pass answerText to handleCardClick
                    >
                      <p>{answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;