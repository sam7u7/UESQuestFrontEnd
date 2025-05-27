// src/pages/DashboardPage.jsx
import React from 'react';

function DashboardPage() {
  return (
    <div className="w-full max-w-4xl text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido al Dashboard</h2>
      <p className="text-lg text-gray-700">
        Aquí es donde verás tus encuestas, estadísticas o configuraciones de administración.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Este contenido se mostrará solo después de iniciar sesión (una vez que implementemos la lógica de autenticación real).
      </p>
    </div>
  );
}

export default DashboardPage;