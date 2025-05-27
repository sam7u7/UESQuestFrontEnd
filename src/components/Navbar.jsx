// src/components/Header.jsx (Actualizado)
import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo/Nombre de la aplicación - Ahora usa primary-blue-800 para el texto */}
        <a href="/" className="text-2xl font-bold text-primary-blue-800 hover:text-primary-blue-700 transition-colors duration-200">
          UESQuest
        </a>

        {/* Navegación (simple por ahora) */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="/crear-encuesta"
                className="text-gray-600 hover:text-primary-blue-600 transition-colors duration-200 font-medium"
              >
                Crear Encuesta
              </a>
            </li>
            <li>
              <a
                href="/mis-encuestas"
                className="text-gray-600 hover:text-primary-blue-600 transition-colors duration-200 font-medium"
              >
                Mis Encuestas
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="text-gray-600 hover:text-primary-blue-600 transition-colors duration-200 font-medium"
              >
                Iniciar Sesión
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;