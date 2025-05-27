// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay: fixed y un z-index bajo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" // z-10 es más bajo que el contenido principal (z-20)
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar en sí: fixed y un z-index más alto */}
      <aside
        // fixed inset-y-0 left-0 w-64 para posicionamiento y ancho
        // transform y transition-transform para la animación
        // z-30 para estar por encima del contenido principal cuando está abierto
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
            <li>
              <Link to="/crear-encuesta" onClick={onClose} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Crear Encuesta
              </Link>
            </li>
            <li>
              <Link to="/mis-encuestas" onClick={onClose} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Mis Encuestas
              </Link>
            </li>
            <li>
              <Link to="/roles" onClick={onClose} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Gestión de Roles
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;