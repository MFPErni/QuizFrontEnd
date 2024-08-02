// src/components/Home.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect'; // Import the custom hook

const Home = () => {
  useAuthRedirect(); // Use the custom hook

  const username = useSelector((state) => state.user.username); // Get the username from the Redux store

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">Welcome to the Home Page</h1>
      </div>
    </div>
  );
};

export default Home;