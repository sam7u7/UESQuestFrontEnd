// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- Importamos useAuth

function Sidebar({ isOpen, onClose }) {
  const { user, hasRole } = useAuth(); // <--- Usamos el hook useAuth para obtener el usuario y la función hasRole

  // Un solo estado para controlar qué menú está abierto
  // Almacenará el nombre del menú abierto ('encuestas', 'grupos', 'cuentas') o null si ninguno
  const [openMenu, setOpenMenu] = useState(null);

  // Función para manejar el clic en un encabezado de menú
  const handleMenuToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // Helper para renderizar los elementos de un submenú
  const MenuItem = ({ to, label }) => (
    <li>
      <Link
        to={to}
        onClick={onClose} // Cierra el sidebar completamente al hacer clic en un enlace
        className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {label}
      </Link>
    </li>
  );

  return (
    <>
      {/* Overlay: fixed y un z-index bajo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar en sí: fixed y un z-index más alto */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none"
            aria-label="Cerrar menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-5">
          <ul>
            {/* ============================================================== */}
            {/* Menú Gestión de Encuestas */}
            {/* ============================================================== */}
            <li>
              <button
                onClick={() => handleMenuToggle('encuestas')}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Gestión de Encuestas
                <svg
                  className={`h-5 w-5 transition-transform ${openMenu === 'encuestas' ? 'rotate-90' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openMenu === 'encuestas' ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <ul className="ml-2">
                  {/* Solo visible para 'admin' */}
                  {hasRole('admin') && <MenuItem to="/crear-encuesta" label="Crear Encuesta" />}
                  {/* Visible para 'admin' y 'usuario' */}
                  {(hasRole('admin') || hasRole('usuario')) && <MenuItem to="/encuestas/diponibles" label="Encuestas Disponibles" />}
                </ul>
              </div>
            </li>

            {/* ============================================================== */}
            {/* Menú Gestión de Grupos */}
            {/* ============================================================== */}
            <li>
              <button
                onClick={() => handleMenuToggle('grupos')}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Gestión de Grupos
                <svg
                  className={`h-5 w-5 transition-transform ${openMenu === 'grupos' ? 'rotate-90' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openMenu === 'grupos' ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <ul className="ml-2">
                  {/* Solo visible para 'admin' */}
                  {hasRole('admin') && <MenuItem to="/grupo-meta" label="Gestión Grupo Meta" />}
                  {hasRole('admin') && <MenuItem to="/grupo-usuario" label="Gestión Grupo Usuario" />}
                  {/* Esto es un placeholder para "Inscribirse en Grupo" para el usuario */}
                  {hasRole('usuario') && <MenuItem to="/inscribirse-grupo" label="Inscribirse en Grupo" />}
                </ul>
              </div>
            </li>

            {/* ============================================================== */}
            {/* Menú Gestión de Cuentas */}
            {/* ============================================================== */}
            <li>
              <button
                onClick={() => handleMenuToggle('cuentas')}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Gestión de Cuentas
                <svg
                  className={`h-5 w-5 transition-transform ${openMenu === 'cuentas' ? 'rotate-90' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openMenu === 'cuentas' ? 'max-h-60' : 'max-h-0' // Ajusta max-h si agregas más elementos
                }`}
              >
                <ul className="ml-2">
                  {/* Visible para 'admin' y 'usuario' */}
                  {(hasRole('admin') || hasRole('usuario')) && <MenuItem to="/usuario-nuevo" label="Mi Usuario" />}
                  {/* Solo visible para 'admin' */}
                  {hasRole('admin') && <MenuItem to="/usuario" label="Gestión de Usuarios" />}
                  {hasRole('admin') && <MenuItem to="/roles" label="Gestión de Roles" />}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;