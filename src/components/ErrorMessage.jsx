import React from 'react';

import { Loader2, AlertCircle, Info } from 'lucide-react';

function ErrorMessage ({ message }){
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 rounded-xl shadow-lg m-4 border-l-4 border-red-500">
      <AlertCircle className="text-red-600 w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">¡Ups! Algo salió mal.</h2>
      <p className="text-lg text-red-600 text-center">{message || 'Ha ocurrido un error inesperado.'}</p>
      <p className="text-red-500 mt-3">Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.</p>
    </div>
  );
};
export default ErrorMessage;
