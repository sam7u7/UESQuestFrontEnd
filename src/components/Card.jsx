// src/components/Card.jsx
import React from 'react';

// El componente Card será un contenedor flexible para cualquier contenido.
// Recibirá `children` (el contenido que se colocará dentro de la tarjeta)
// y opcionalmente `className` para añadir clases adicionales desde donde se use.
function Card({ children, className = '', ...props }) {
  const baseClasses = 'bg-white p-6 rounded-lg shadow-sm border border-gray-100';

  return (
    <div
      className={`${baseClasses} ${className}`}
      {...props} // Pasa cualquier otra prop (ej. onClick, aria-label) al div
    >
      {children}
    </div>
  );
}

export default Card;