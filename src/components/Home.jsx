// Home.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import BackgroundWrapper from './BackgroundWrapper';

const Home = () => {
  useAuthRedirect();

  const username = useSelector((state) => state.user.username);

  useEffect(() => {
    console.log('Current Username:', username);
  }, [username]);

  return (
    <BackgroundWrapper>
      <NavigationBar />
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-shadow-lg">Welcome to MPdiments</h1>
          <p className="mt-2 text-shadow-lg">Transforming Impediments into Opportunities!</p>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Home;