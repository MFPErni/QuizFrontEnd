// src/components/Home.jsx

import React from 'react';
import NavigationBar from './NavigationBar';

const Home = () => {
  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-poppins">Welcome to the Home Page</h1>
        <p className="font-poppins">This is a paragraph with the Poppins font.</p>
        <p>This is a paragraph with the default font.</p>
      </div>
    </div>
  );
};

export default Home;