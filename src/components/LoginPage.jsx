// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../axios/axiosconfig';
import { setUsername } from '../userSlice';

const LoginPage = () => {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = {};

    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.get(`/admin/check-credentials?username=${username}&password=${password}`);
      const result = response.data;
      console.log('Login Response:', result);

      // Save the username in the Redux store
      dispatch(setUsername(username));

      // Redirect to home page
      navigate('/home');
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
      } else if (error.request) {
        console.error('Error Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
          </div>
          <div className="mt-4 text-center">
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Create an Account
            </Link>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;