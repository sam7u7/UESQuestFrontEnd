// src/components/RadioInput.jsx
import React from 'react';

function RadioInput({ label, id, name, ...props }) {
  return (
    <div className="flex items-center mb-2">
      <input
        type="radio"
        id={id}
        name={name} // Importante: Los radio buttons con el mismo 'name' son parte del mismo grupo
        className="hidden" // Oculta el radio button nativo
        {...props} // Pasa todas las props como `checked`, `onChange`, `value`
      />
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer text-gray-700 select-none"
      >
        {/* Elemento visual personalizado para el radio button */}
        <div className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2 transition-all duration-200">
          {/* El círculo interior visible cuando está marcado */}
          {props.checked && (
            <div className="w-3 h-3 bg-gray-900 rounded-full"></div> // Círculo interior casi negro
          )}
        </div>
        {label}
      </label>
    </div>
  );
}

export default RadioInput;