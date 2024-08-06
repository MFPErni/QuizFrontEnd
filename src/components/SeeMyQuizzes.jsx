import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import BackgroundWrapper from './BackgroundWrapper';

const SeeMyQuizzes = () => {
  useAuthRedirect();

  const username = useSelector((state) => state.user.username);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current Username:', username);

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`/quiz/quizzes-by-admin?username=${username}`);
        const quizzesData = response.data.$values; // Access the $values property

        if (Array.isArray(quizzesData)) {
          setQuizzes(quizzesData);
        } else {
          console.error('Unexpected response structure:', quizzesData);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [username]);

  const handleDeleteClick = async (quizID) => {
    try {
      const questionResponse = await axios.get(`/question/questions-by-quiz/${quizID}`);
      const questionsData = questionResponse.data.$values; // Access the $values property

      if (Array.isArray(questionsData)) {
        for (const question of questionsData) {
          try {
            const answerResponse = await axios.get(`/answer/answers-by-question/${question.questionID}`);
            const answersData = answerResponse.data.$values; // Access the $values property

            if (Array.isArray(answersData)) {
              for (const answer of answersData) {
                console.log('Deleting AnswerID:', answer.answerID);
                try {
                  await axios.delete(`/answer/${answer.answerID}`);
                } catch (error) {
                  console.error(`Error deleting AnswerID ${answer.answerID}:`, error);
                }
              }
            } else {
              console.error('Unexpected response structure:', answersData);
            }
          } catch (error) {
            console.error('Error fetching answers:', error);
          }
          console.log('Deleting QuestionID:', question.questionID);
          try {
            await axios.delete(`/question/${question.questionID}`);
          } catch (error) {
            console.error(`Error deleting QuestionID ${question.questionID}:`, error);
          }
        }
      } else {
        console.error('Unexpected response structure:', questionsData);
      }
      console.log('Deleting QuizID:', quizID);
      try {
        await axios.delete(`/quiz/${quizID}`);
      } catch (error) {
        console.error(`Error deleting QuizID ${quizID}:`, error);
      }
    } catch (error) {
      console.error('Error deleting quiz or its related data:', error);
    }

    // Refresh the quizzes list after deletion
    try {
      const response = await axios.get(`/quiz/quizzes-by-admin?username=${username}`);
      const quizzesData = response.data.$values; // Access the $values property

      if (Array.isArray(quizzesData)) {
        setQuizzes(quizzesData);
      } else {
        console.error('Unexpected response structure:', quizzesData);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleCreateQuizClick = () => {
    navigate('/create-quiz');
  };

  const handleEditClick = (quizID) => {
    navigate(`/edit-quiz/${quizID}`);
  };

  return (
    <BackgroundWrapper>
      <NavigationBar />
      <div className="p-4 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-poppins font-bold text-shadow-lg">Your Quizzes</h1>
          <button 
            className="px-4 py-2 bg-purple-600 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
            onClick={handleCreateQuizClick}
          >
            Create a Quiz!
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.quizID} className="p-4 bg-black bg-opacity-80 shadow rounded-lg">
              <h3 className="text-lg font-poppins font-bold text-white">{quiz.title}</h3>
              <p className="text-sm text-gray-300">{quiz.categoryTitle}</p>
              <div className="mt-2 flex justify-between">
                <button 
                  className="px-4 py-2 bg-green-500 text-white font-poppins font-bold bg-opacity-80 text-shadow-lg rounded"
                  onClick={() => handleEditClick(quiz.quizID)}
                >
                  Edit
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
                  onClick={() => handleDeleteClick(quiz.quizID)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default SeeMyQuizzes;