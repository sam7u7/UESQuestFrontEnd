// src/components/AlertMessage.jsx
import React from 'react';

function AlertMessage({ message, type = 'info', className = '' }) {
  let bgColor = '';
  let textColor = '';
  let borderColor = '';
  //let icon = null; // Podríamos añadir iconos más adelante

  switch (type) {
    case 'success':
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      borderColor = 'border-green-300';
      break;
    case 'error':
      bgColor = 'bg-red-50';
      textColor = 'text-red-800';
      borderColor = 'border-red-300';
      break;
    case 'warning':
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-800';
      borderColor = 'border-yellow-300';
      break;
    case 'info':
    default: // Default será info, usando grises para la estética minimalista
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      borderColor = 'border-gray-300';
      break;
  }

  if (!message) return null; // No renderiza si no hay mensaje

  return (
    <div
      className={`p-4 rounded-md border ${bgColor} ${textColor} ${borderColor} ${className}`}
      role="alert" // Para accesibilidad
    >
      <div className="flex items-center">
        {/* Aquí podríamos añadir iconos según el tipo de mensaje */}
        {/* {icon && <span className="mr-2">{icon}</span>} */}
        <p className="font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}

export default AlertMessage;