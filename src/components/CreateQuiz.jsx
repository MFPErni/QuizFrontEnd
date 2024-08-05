import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import axios from '../axios/axiosconfig';

const CreateQuiz = () => {
  useAuthRedirect();

  const username = useSelector((state) => state.user.username);
  const [adminID, setAdminID] = useState(null); // New state for adminID
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryID: '',
    numberOfQuestions: '' // New state for number of questions
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

  useEffect(() => {
    const fetchAdminID = async () => {
      try {
        const response = await axios.get(`/admin/get-admin-id?username=${username}`);
        setAdminID(response.data); // Set the adminID
      } catch (error) {
        console.error('Error fetching admin ID:', error);
      }
    };

    fetchAdminID();
  }, [username]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCreateQuiz = () => {
    console.log('Admin ID:', adminID); // Log the adminID
    console.log('Title:', formData.title);
    console.log('Description:', formData.description);
    console.log('Category ID:', formData.categoryID);
    console.log('Number of Questions:', formData.numberOfQuestions); // Log the number of questions
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Create a New Quiz</h1>
        <div className="mb-4 p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold">Add Question</h2>
          {/* Placeholder for future functionalities */}
        </div>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfQuestions">
              Number of Questions
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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