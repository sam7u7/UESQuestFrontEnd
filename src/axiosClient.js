// src/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000', //Ruta cuando se corre laravel 
  withCredentials: true, // Importante para cookies de Sanctum
});

export default axiosClient;
