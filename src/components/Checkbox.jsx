// src/components/Checkbox.jsx
import React from 'react';

function Checkbox({ label, id, name, ...props }) {
  return (
    <div className="flex items-center mb-2"> {/* Contenedor flex para alinear checkbox y label */}
      <input
        type="checkbox"
        id={id}
        name={name}
        className="hidden" // Oculta el checkbox nativo
        {...props} // Pasa todas las props como `checked`, `onChange`
      />
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer text-gray-700 select-none" // Estilo para el label y el área interactiva
      >
        {/* Elemento visual personalizado para el checkbox */}
        <div className="w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center mr-2 transition-all duration-200">
          {/* Icono de "check" visible cuando está marcado */}
          {props.checked && (
            <svg
              className="w-4 h-4 text-gray-900" // Color oscuro para el check
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
        {label} {/* El texto del label */}
      </label>
    </div>
  );
}

export default Checkbox;