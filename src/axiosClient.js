// src/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000', //Ruta cuando se corre laravel 
  
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(response => {
  return response;
}, error => {
  const { response } = error;
  if (response.status === 401) {
    // Si la respuesta es 401 (No autorizado), limpia el token y redirige.
    // Esto se ejecutará si el token es inválido o expirado.
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Usa window.location para una recarga completa
  }
  throw error;
});


export default axiosClient;
