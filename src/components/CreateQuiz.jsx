// src/components/CreateQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import axios from '../axios/axiosconfig';

const CreateQuiz = () => {
  useAuthRedirect();

  const username = useSelector((state) => state.user.username);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryID: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/category/titles');
        const categoryTitles = response.data.$values; // Extract the $values array
        setCategories(categoryTitles);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCreateQuiz = () => {
    console.log('Admin Username:', username);
    console.log('Title:', formData.title);
    console.log('Description:', formData.description);
    console.log('Category ID:', formData.categoryID);
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Create a New Quiz</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryID">
              Category
            </label>
            <select
              id="categoryID"
              value={formData.categoryID}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={index + 1}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;