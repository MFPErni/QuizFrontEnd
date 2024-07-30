// src/components/LoginPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic here
    navigate('/home');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;