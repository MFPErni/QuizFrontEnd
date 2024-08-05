import React, { useState, useEffect } from 'react';
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
    handleFetchCategories();
  }, []);

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/quiz/categories');
      const categoryData = response.data;
      console.log('Fetched Unique Category Titles:', categoryData); // Debug statement

      // Extract the $values property if it exists
      const categoryTitles = categoryData.$values || [];
      if (Array.isArray(categoryTitles)) {
        setCategories(categoryTitles);

        // Fetch quizzes for each category
        categoryTitles.forEach(async (categoryTitle) => {
          const categoryIdResponse = await axios.get(`/category/category-id?title=${categoryTitle}`);
          const categoryId = categoryIdResponse.data;
          console.log(`Category ID for "${categoryTitle}":`, categoryId); // Log the CategoryID

          const quizzesResponse = await axios.get(`/quiz/quizzes-by-category/${categoryId}`);
          const quizzesData = quizzesResponse.data.$values || [];
          console.log(`Fetched Quizzes for Category ID ${categoryId}:`, quizzesData); // Log the quizzes

          // Update the state with the fetched quizzes
          setQuizzesByCategory(prevState => ({
            ...prevState,
            [categoryTitle]: quizzesData
          }));
        });
      } else {
        console.error('Unexpected response structure:', categoryData);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching unique category titles:', error);
      setCategories([]);
    }
  };

  const handleCardClick = (quizID, quizTitle, quizDescription, quizCategoryTitle) => {
    navigate(`/quiz-details/${quizID}`, {
      state: {
        quizID,
        quizTitle,
        quizDescription,
        quizCategoryTitle
      }
    });
  };

  const handleSeeMyQuizzesClick = () => {
    navigate('/see-my-quizzes');
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories Page</h1>
          <button 
            className="px-4 py-2 bg-purple-500 text-white rounded"
            onClick={handleSeeMyQuizzesClick}
          >
            See My Quizzes
          </button>
        </div>
        <ul className="mt-4">
          {categories.map((category, index) => (
            <li key={index} className="py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{category}</span>
              </div>
              {quizzesByCategory[category] && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {quizzesByCategory[category].map((quiz, quizIndex) => (
                    <div
                      key={quizIndex}
                      className="p-4 bg-white shadow rounded-lg cursor-pointer"
                      onClick={() => handleCardClick(quiz.quizID, quiz.title, quiz.description, quiz.categoryTitle)}
                    >
                      <h3 className="text-lg font-bold">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">Quiz ID: {quiz.quizID}</p>
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