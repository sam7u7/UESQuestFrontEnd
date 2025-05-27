// src/components/PaginationControls.jsx
import React from 'react';
import Button from './Button'; // Importamos nuestro componente Button

function PaginationControls({
  currentPage, // Número de página actual (ej. 1, 2, 3...)
  totalPages,  // Número total de páginas
  onNext,      // Función para ir a la siguiente página
  onPrevious,  // Función para ir a la página anterior
  className = '', // Para clases adicionales en el contenedor
}) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={`flex items-center justify-between w-full max-w-lg mx-auto ${className}`}>
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={isFirstPage} // Deshabilitar si es la primera página
      >
        Anterior
      </Button>

      {/* Indicador de progreso minimalista */}
      <span className="text-gray-700 text-sm font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="primary"
        onClick={onNext}
        disabled={isLastPage} // Deshabilitar si es la última página
      >
        Siguiente
      </Button>
    </div>
  );
}

export default PaginationControls;