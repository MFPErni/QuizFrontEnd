import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [quizzesByCategory, setQuizzesByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndQuizzes = async () => {
      try {
        const categoryResponse = await axios.get('/quiz/categories');
        const categoryTitles = categoryResponse.data.$values || [];
        setCategories(categoryTitles);

        const quizzes = {};
        for (let i = 0; i < categoryTitles.length; i++) {
          const categoryId = i + 1;
          const quizResponse = await axios.get(`/quiz/category/${categoryId}`);
          quizzes[categoryId] = quizResponse.data.$values || [];
        }
        setQuizzesByCategory(quizzes);
      } catch (error) {
        console.error('Error fetching categories or quizzes:', error);
      }
    };

    fetchCategoriesAndQuizzes();
  }, []);

  const handleQuizClick = (quizTitle, quizDescription, categoryTitle) => {
    console.log(`Quiz Title: ${quizTitle}`);
    console.log(`Quiz Description: ${quizDescription}`);
    console.log(`Category Title: ${categoryTitle}`);
    navigate(`/quiz/${encodeURIComponent(quizTitle)}`, {
      state: { description: quizDescription },
    }); // Navigate to the quiz details page with state
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Categories Page</h1>
        <div className="mt-4">
          {categories.map((category, index) => (
            <div key={index} className="mb-6">
              <div className="p-2 border-b border-gray-200">
                {category}
              </div>
              <div className="mt-2">
                {quizzesByCategory[index + 1] && quizzesByCategory[index + 1].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzesByCategory[index + 1].map((quiz, quizIndex) => (
                      <div
                        key={quizIndex}
                        className="p-4 border rounded shadow"
                        onClick={() => handleQuizClick(quiz.title, quiz.description, quiz.categoryTitle)} // Add onClick handler
                      >
                        <h3 className="text-lg font-bold">{quiz.title}</h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No quizzes available for this category.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;