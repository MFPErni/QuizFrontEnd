// src/components/Home.jsx

import React from 'react';
import NavigationBar from './NavigationBar';

const Home = () => {
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