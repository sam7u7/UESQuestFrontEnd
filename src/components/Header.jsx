import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();

  // Obtener el token almacenado
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = !!authToken;

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Eliminar token
    navigate('/App'); // Redirigir al login
  };

  return (
    <header className="fixed top-0 left-0 z-40 bg-white shadow-sm py-4 w-full">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        
        {/* CONTENEDOR IZQUIERDO: Botón de menú */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* LOGO / NOMBRE DE LA APLICACIÓN */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            UESQuest
          </Link>
        </div>

        {/* CONTENEDOR DERECHO: Navegación */}
        <div className="flex items-center">
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-gray-700 hover:text-gray-900 font-medium">
                  ¿Quiénes Somos?
                </Link>
              </li>
              <li>
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout} 
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Cerrar Sesión
                  </button>
                ) : (
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                    Iniciar Sesión
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </header>
  );
}

export default Header;
