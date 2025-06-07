// src/views/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">¡Acceso Denegado!</h1>
      <p className="text-lg text-gray-700 mb-8">
        No tienes los permisos necesarios para ver esta página.
      </p>
      <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Ir al Dashboard
      </Link>
      <Link to="/login" className="mt-4 text-blue-500 hover:underline">
        Volver a Iniciar Sesión
      </Link>
    </div>
  );
};

export default UnauthorizedPage;