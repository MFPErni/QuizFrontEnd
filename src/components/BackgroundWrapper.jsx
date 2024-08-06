// BackgroundWrapper.jsx
import React from 'react';

const BackgroundWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://64.media.tumblr.com/2b0ec5e7d4763b0cc6aaba6982be379c/tumblr_occujlvMQE1qze3hdo1_r2_500.gif)' }}>
      {children}
    </div>
  );
};

export default BackgroundWrapper;