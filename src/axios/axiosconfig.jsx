import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5026/api', // Replace with your backend server URL and port
});

export default instance;