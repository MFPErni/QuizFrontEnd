import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/index.css'; // Ensure this path is correct

// Import Poppins font
import '@fontsource/poppins/400.css'; // Regular weight
import '@fontsource/poppins/500.css'; // Medium weight
import '@fontsource/poppins/600.css'; // Semi-bold weight
import '@fontsource/poppins/700.css'; // Bold weight

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);