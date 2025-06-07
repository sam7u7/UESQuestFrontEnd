// src/components/Button.jsx
import React from 'react';

// Este componente recibirá `children` (el texto o contenido del botón)
// y `variant` para definir si es primario o secundario (y así su estilo)
// También puede recibir otras props HTML como `onClick`, `type`, etc.
function Button({ children, variant = 'primary', ...props }) {
  // Definimos las clases base que todos los botones tendrán
  const baseClasses = 'py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

  // Definimos las clases específicas para cada variante
  let variantClasses = '';
  if (variant === 'primary') {
    // Botón principal: fondo oscuro, texto claro.
    // El foco será un anillo con un gris medio.
    variantClasses = 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500';
  } else if (variant === 'secondary') {
    // Botón secundario: fondo claro, texto oscuro, borde.
    // El foco será un anillo con un gris más claro.
    variantClasses = 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-300';
  } else if (variant === 'text') {
    // Botón de solo texto (útil para acciones menos prominentes)
    variantClasses = 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300';
  } else if (variant === 'danger') {
    // Opcional: un botón para acciones destructivas (aunque es gris, el color rojo implicaría un cambio de paleta)
    // Por ahora, lo dejaremos como un gris muy oscuro para la acción peligrosa.
    variantClasses = 'bg-gray-800 text-white hover:bg-gray-800 focus:ring-red-400';
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      {...props} // Pasa cualquier otra prop (como onClick, type, disabled) al elemento button nativo
    >
      {children}
    </button>
  );
}

export default Button;