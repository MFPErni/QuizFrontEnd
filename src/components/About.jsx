// src/components/About.jsx

import React from 'react';
import NavigationBar from './NavigationBar';

const About = () => {
  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">About Page</h1>
      </div>
    </div>
  );
};

export default About;