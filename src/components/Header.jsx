import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';

function Header({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = !!authToken;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosClient.get('/api/usuarios/me');
        setUserData(res.data);
      } catch (err) {
        console.error('Error al obtener el usuario:', err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const formatFecha = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  return (
    <header className="fixed top-0 left-0 z-40 bg-white shadow-sm py-4 w-full">
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-4 lg:px-8">
        {/* Botón de menú */}
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

        {/* Logo */}
        <div className="flex-grow text-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:flex-grow-0 lg:text-left">
          <Link to="/home" className="text-lg sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            UESQuest
          </Link>
        </div>

        {/* Navegación */}
        <div className="flex items-center ml-auto">
          <nav>
            <ul className="flex flex-wrap justify-end space-x-1 sm:space-x-2 md:space-x-4">
              <li>
                <Link to="/home" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900">
                  ¿Quiénes Somos?
                </Link>
              </li>
              <li className="relative flex items-center" ref={menuRef}>
                {isAuthenticated && userData ? (
                  <div>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-1 relative py-1 -mt-0.5"
                    >
                      <span>{userData.nombre}</span>
                      <span className="text-[11px] text-gray-500">({formatFecha()})</span>
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium text-xs sm:text-sm">
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

