import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';

const Categories = () => {
  useAuthRedirect();

  const [categories, setCategories] = useState([]);
  const [quizzesByCategory, setQuizzesByCategory] = useState({});
  const navigate = useNavigate();

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/quiz/categories');
      const categoryData = response.data;
      console.log('Fetched Unique Category Titles:', categoryData); // Debug statement

      // Extract the $values property if it exists
      const categoryTitles = categoryData.$values || [];
      if (Array.isArray(categoryTitles)) {
        setCategories(categoryTitles);
      } else {
        console.error('Unexpected response structure:', categoryData);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching unique category titles:', error);
      setCategories([]);
    }
  };

  const handleCategoryClick = async (categoryTitle) => {
    try {
      // Fetch the CategoryID for the given category title
      const categoryIdResponse = await axios.get(`/category/category-id?title=${categoryTitle}`);
      const categoryId = categoryIdResponse.data;
      console.log(`Category ID for "${categoryTitle}":`, categoryId); // Log the CategoryID

      // Fetch the quizzes for the given CategoryID
      const quizzesResponse = await axios.get(`/quiz/quizzes-by-category/${categoryId}`);
      const quizzesData = quizzesResponse.data.$values || [];
      console.log(`Fetched Quizzes for Category ID ${categoryId}:`, quizzesData); // Log the quizzes

      // Log the titles of the quizzes
      const quizTitles = quizzesData.map(quiz => quiz.title);
      console.log('Quiz Titles:', quizTitles);

      // Log the IDs of the quizzes
      const quizIDs = quizzesData.map(quiz => quiz.quizID);
      console.log('Quiz IDs:', quizIDs);

      // Update the state with the fetched quizzes
      setQuizzesByCategory(prevState => ({
        ...prevState,
        [categoryTitle]: quizzesData
      }));
    } catch (error) {
      console.error(`Error fetching quizzes for category title "${categoryTitle}":`, error);
    }
  };

  const handleCardClick = async (quizID, quizTitle, quizDescription, quizCategoryTitle) => {
    try {
      navigate(`/quiz-details/${quizID}`, {
        state: {
          quizID,
          quizTitle,
          quizDescription,
          quizCategoryTitle
        }
      });
    } catch (error) {
      console.error(`Error navigating to quiz details for quizID ${quizID}:`, error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Categories Page</h1>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleFetchCategories}
        >
          Fetch Unique Category Titles
        </button>
        <ul className="mt-4">
          {categories.map((category, index) => (
            <li key={index} className="py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{category}</span>
                <button 
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleCategoryClick(category)}
                >
                  Get Category ID
                </button>
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