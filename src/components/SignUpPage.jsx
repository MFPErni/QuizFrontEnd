import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSignUp = async () => {
    // Validate fields
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';

    // Check if username already exists
    if (formData.username) {
      try {
        const response = await axios.get(`/admin/username-exists?username=${formData.username}`);
        if (response.data) {
          newErrors.username = 'Username already exists';
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    }

    setErrors(newErrors);

    // If there are errors, do not proceed
    if (Object.keys(newErrors).length > 0) return;

    // Create new admin
    try {
      const response = await axios.post('/admin/create-admin', formData);
      console.log('Admin created successfully:', response.data);
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form>
          {['firstName', 'lastName', 'username', 'password'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace('Name', ' Name')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[field] ? 'border-red-500' : ''}`}
                required
              />
              {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
            </div>
          ))}
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Already have an account?
            </Link>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;