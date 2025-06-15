import React from 'react';
// Para los iconos, asegurate de tener lucide-react instalado: npm install lucide-react
import { Loader2, AlertCircle, Info } from 'lucide-react';

const NoDataFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4 rounded-xl shadow-lg m-4 border-l-4 border-yellow-500">
      <Info className="text-yellow-600 w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-yellow-700 mb-2">No se encontraron datos.</h2>
      <p className="text-lg text-yellow-600 text-center">Parece que no hay información disponible para mostrar en este momento.</p>
      <p className="text-yellow-500 mt-3">Prueba a recargar la página o ajustar tus filtros de búsqueda.</p>
    </div>
  );
};

export default NoDataFound;