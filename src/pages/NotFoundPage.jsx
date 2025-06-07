// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Si quieres un enlace para volver

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Página No Encontrada</h2>
      <p className="text-lg text-gray-600 mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md 
                   hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Volver a la Página de Inicio
      </Link>
    </div>
  );
};

// <--- ¡Esta es la línea clave que falta!
export default NotFoundPage;
