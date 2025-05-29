// src/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000', //Ruta cuando se corre laravel 
  
});

export default axiosClient;
