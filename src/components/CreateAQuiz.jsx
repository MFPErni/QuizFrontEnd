// src/components/CreateAQuiz.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';

const CreateAQuiz = () => {
  useAuthRedirect();

  const username = useSelector((state) => state.user.username);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    console.log('Current Username:', username);

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`/quiz/quizzes-by-admin?username=${username}`);
        const quizzesData = response.data.$values; // Access the $values property
        console.log('Response Data:', quizzesData);

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

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Your Quizzes</h1>
        <div className="mt-4">
          {quizzes.map((quiz) => (
            <div key={quiz.quizID} className="py-2 border-b border-gray-200">
              <h3 className="text-lg font-bold">{quiz.title}</h3>
              <p className="text-md">{quiz.categoryTitle}</p>
              <div className="mt-2">
                <button 
                  className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
                  onClick={() => { /* Add Edit functionality here later */ }}
                >
                  Edit
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => { /* Add Delete functionality here later */ }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAQuiz;