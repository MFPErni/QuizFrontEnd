// src/components/HowToPlay.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; // Add this import statement
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';

const HowToPlay = () => {
  useAuthRedirect();

  const username = useSelector((state) => state.user.username);

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">How To Play Page</h1>
      </div>
    </div>
  );
};

export default HowToPlay;