// src/hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const useAuthRedirect = () => {
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);
};

export default useAuthRedirect;