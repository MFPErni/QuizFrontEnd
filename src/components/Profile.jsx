// src/components/Profile.jsx

import React from 'react';
import NavigationBar from './NavigationBar';

const Profile = () => {
  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Profile Page</h1>
      </div>
    </div>
  );
};

export default Profile;