import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from '../axios/axiosconfig';
import { setUsername } from '../userSlice';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.get(`/admin/check-credentials?username=${data.username}&password=${data.password}`);
      const result = response.data;
      console.log('Login Response:', result);

      dispatch(setUsername(data.username));

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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black px-4 font-poppins">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className={`absolute top-[-120px] h-[100px] w-[100px] z-[-1] animate-zigzagSpin`}
              style={{
                left: `${(i % 10) * 10}%`,
                animationDelay: `${i * 0.6}s`,
                backgroundColor: i % 2 === 0 ? 'transparent' : undefined,
                borderColor: i % 2 === 0 ? 'cyan' : undefined,
                borderWidth: i % 2 === 0 ? '5px' : undefined,
                width: i % 2 === 0 ? undefined : `${100 + (i % 10) * 20}px`,
                height: i % 2 === 0 ? undefined : `${100 + (i % 10) * 20}px`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register('username', { required: 'Username is required' })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
          </div>
          <div className="mt-4 text-center">
            <Link to="/signup" className="text-blue-300 hover:text-blue-500">
              Create an Account
            </Link>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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