// src/components/Categories.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';

const Categories = () => {
  useAuthRedirect();

  const [categories, setCategories] = useState([]);
  const [quizzesByCategory, setQuizzesByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/quiz/categories');
        const categoryTitles = response.data.$values;
        setCategories(categoryTitles);

        categoryTitles.forEach(async (categoryTitle, index) => {
          const categoryId = index + 1;
          const quizResponse = await axios.get(`/quiz/quizzes-by-category/${categoryId}`);
          const quizData = quizResponse.data.$values;

          setQuizzesByCategory(prevState => ({
            ...prevState,
            [categoryTitle]: quizData
          }));
        });
      } catch (error) {
        console.error('Error fetching categories or quizzes:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCardClick = (quiz) => {
    console.log('Quiz Data:', quiz);
    navigate(`/quiz/${quiz.quizID}`, {
      state: {
        quizID: quiz.quizID,
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        quizCategoryTitle: quiz.categoryTitle
      }
    });
  };

  const handleSeeMyQuizzesClick = () => {
    navigate('/create-a-quiz');
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Categories Page</h1>
        <button 
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSeeMyQuizzesClick}
        >
          See My Quizzes!
        </button>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{category}</span>
              </div>
              {quizzesByCategory[category] && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {quizzesByCategory[category].map((quiz, quizIndex) => (
                    <div
                      key={quizIndex}
                      className="p-4 bg-white shadow rounded-lg cursor-pointer"
                      onClick={() => handleCardClick(quiz)}
                    >
                      <h3 className="text-lg font-bold">{quiz.title}</h3>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;