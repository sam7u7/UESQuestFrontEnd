// src/components/TextAreaField.jsx
import React from 'react';

// Este componente recibirá `label`, `name`, `placeholder` y `rows` (para la altura inicial).
// `...props` captura cualquier otra prop estándar de textarea como `value`, `onChange`, `required`, etc.
function TextAreaField({ label, name, placeholder, rows = 4, ...props }) {
  // Clases base para el textarea
  const baseTextAreaClasses = 'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm ' +
                              'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ' +
                              'text-gray-800 placeholder-gray-400 resize-y transition-all duration-200';
  // `resize-y` permite que el usuario redimensione solo verticalmente
  // Puedes usar `resize-none` si no quieres que sea redimensionable, o `resize` para ambos ejes.

  return (
    <div className="mb-4"> {/* Contenedor para el label y el textarea, con margen inferior */}
      {label && ( // Renderiza el label solo si la prop `label` es proporcionada
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        name={name}
        id={name} // Importante para la accesibilidad (conectar label y textarea)
        placeholder={placeholder}
        rows={rows} // Define la altura inicial del textarea en términos de líneas
        className={baseTextAreaClasses}
        {...props} // Pasa cualquier otra prop al textarea nativo
      ></textarea>
    </div>
  );
}

export default TextAreaField;