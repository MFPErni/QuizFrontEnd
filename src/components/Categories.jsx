import React, { useEffect, useState } from 'react';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndQuizzes = async () => {
      try {
        // Fetch unique categories
        const response = await axios.get('/Quiz/UniqueCategories');
        const uniqueCategories = response.data.$values;

        // Fetch quiz titles for each category
        const categoriesWithQuizzes = await Promise.all(
          uniqueCategories.map(async (category) => {
            const quizResponse = await axios.get(`/Quiz/ByCategory/${category.categoryID}`);
            return {
              ...category,
              quizzes: quizResponse.data.$values || [],
            };
          })
        );

        setCategories(categoriesWithQuizzes);
      } catch (error) {
        console.error('Error fetching categories and quizzes:', error);
      }
    };

    fetchCategoriesAndQuizzes();
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Categories Page</h1>
        <ul>
          {categories.map(category => (
            <li key={category.categoryID} className="text-lg mb-4">
              <div className="font-semibold">{category.title}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {category.quizzes.length > 0 ? (
                  category.quizzes.map((title, index) => (
                    <div key={index} className="bg-gray-300 shadow-md rounded-lg p-4">
                      <h3 className="text-lg font-bold">{title}</h3>
                    </div>
                  ))
                ) : (
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-bold">No quizzes available</h3>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;