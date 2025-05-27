// src/components/InputField.jsx
import React from 'react';

// Este componente puede manejar diferentes tipos de inputs (text, email, password, number)
// También puede recibir un `label` y un `placeholder`.
// `type` y `name` son props estándar de los inputs.
// `...props` captura cualquier otra prop como `value`, `onChange`, `required`, etc.
function InputField({ label, type = 'text', name, placeholder, ...props }) {
  // Clases base para el input
  const baseInputClasses = 'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm ' +
                           'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ' +
                           'text-gray-800 placeholder-gray-400 transition-all duration-200';

  return (
    <div className="mb-4"> {/* Contenedor para el label y el input, con margen inferior */}
      {label && ( // Renderiza el label solo si la prop `label` es proporcionada
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name} // Importante para la accesibilidad (conectar label y input)
        placeholder={placeholder}
        className={baseInputClasses}
        {...props} // Pasa cualquier otra prop al input nativo
      />
    </div>
  );
}

export default InputField;