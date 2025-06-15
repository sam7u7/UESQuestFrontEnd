import React from 'react';
// Para los iconos, asegurate de tener lucide-react instalado: npm install lucide-react
import { Loader2, AlertCircle, Info } from 'lucide-react';

// Componente para el estado de carga
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 rounded-xl shadow-lg m-4">
      <Loader2 className="animate-spin text-blue-500 w-16 h-16 mb-4" />
      <p className="text-xl font-semibold text-gray-700">Cargando datos, por favor espera...</p>
      <p className="text-gray-500 mt-2">Estamos buscando la información solicitada.</p>
    </div>
  );
};

export default LoadingSpinner;