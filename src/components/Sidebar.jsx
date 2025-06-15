import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const { hasRole } = useAuth();

  const [openMenu, setOpenMenu] = useState(null);

  const isAdmin = hasRole('admin');
  const isUsuario = hasRole('usuario');

  const handleMenuToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const MenuItem = ({ to, label }) => (
    <li>
      <Link
        to={to}
        onClick={onClose}
        className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:bg-gray-700 focus:text-white rounded"
      >
        {label}
      </Link>
    </li>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

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
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-5" aria-label="Menú principal">
          <ul>
            {/* Gestión de Encuestas */}
            <li>
              <button
                onClick={() => handleMenuToggle('encuestas')}
                aria-expanded={openMenu === 'encuestas'}
                aria-controls="submenu-encuestas"
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
              >
                Gestión de Encuestas
                <svg
                  className={`h-5 w-5 transition-transform ${
                    openMenu === 'encuestas' ? 'rotate-90' : ''
                  }`}
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
                id="submenu-encuestas"
                aria-hidden={openMenu !== 'encuestas'}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openMenu === 'encuestas' ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <ul className="ml-2">
                  {isAdmin && <MenuItem to="/crear-encuesta" label="Crear Encuesta" />}
                  {(isAdmin || isUsuario) && (
                    <MenuItem to="/encuestas/diponibles" label="Encuestas Disponibles" />
                  )}
                </ul>
              </div>
            </li>

            {/* Gestión de Grupos */}
              {!isUsuario && (
                <li>
                  <button
                    onClick={() => handleMenuToggle('grupos')}
                    aria-expanded={openMenu === 'grupos'}
                    aria-controls="submenu-grupos"
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
                  >
                    Gestión de Grupos
                    <svg
                      className={`h-5 w-5 transition-transform ${
                        openMenu === 'grupos' ? 'rotate-90' : ''
                      }`}
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
                    id="submenu-grupos"
                    aria-hidden={openMenu !== 'grupos'}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openMenu === 'grupos' ? 'max-h-40' : 'max-h-0'
                    }`}
                  >
                    <ul className="ml-2">
                      {isAdmin && <MenuItem to="/grupo-meta" label="Gestión Grupo Meta" />}
                      {isAdmin && <MenuItem to="/grupo-usuario" label="Gestión Grupo Usuario" />}
                    </ul>
                  </div>
                </li>
              )}

            {/* Gestión de Cuentas */}
            <li>
              <button
                onClick={() => handleMenuToggle('cuentas')}
                aria-expanded={openMenu === 'cuentas'}
                aria-controls="submenu-cuentas"
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
              >
                Gestión de Cuentas
                <svg
                  className={`h-5 w-5 transition-transform ${
                    openMenu === 'cuentas' ? 'rotate-90' : ''
                  }`}
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
                id="submenu-cuentas"
                aria-hidden={openMenu !== 'cuentas'}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openMenu === 'cuentas' ? 'max-h-60' : 'max-h-0'
                }`}
              >
                <ul className="ml-2">
                  {(isAdmin || isUsuario) && <MenuItem to="/usuario-nuevo" label="Mi Usuario" />}
                  {isAdmin && <MenuItem to="/roles" label="Gestión de Roles" />}
                  {isAdmin && <MenuItem to="/usuario" label="Gestión de Usuarios" />}
                  {isAdmin && <MenuItem to="/usuarios/estado" label="Estado de Usuarios" />}
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
