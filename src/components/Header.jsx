// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ onToggleSidebar, isSidebarOpen }) {
  return (
    
    
    
    <header className="fixed top-0 left-0 z-40 bg-white shadow-sm py-4 w-full">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">

        {/* CONTENEDOR IZQUIERDO: Botón de hamburguesa/cerrar */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isSidebarOpen ? (
              <svg className="h-6 w-6 transform rotate-90 transition-transform duration-300 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 transition-transform duration-300 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* LOGO / NOMBRE DE LA APLICACIÓN: Centrado (o donde desees) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
           <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
             UESQuest
           </Link>
        </div>

        {/* CONTENEDOR DERECHO: Navegación Principal */}
        <div className="flex items-center">
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  ¿Quiénes Somos?
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;