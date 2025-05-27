// src/components/Footer.jsx (Actualizado para Grises)
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Fondo gris ligeramente más oscuro que el fondo de la página
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto text-center text-gray-600 text-sm px-4 sm:px-6 lg:px-8">
        <p>&copy; {currentYear} UESQuest. Todos los derechos reservados.</p>
        <p className="mt-2">
          <a href="/politica-privacidad" className="hover:text-gray-800 transition-colors duration-200">
            Política de Privacidad
          </a>{' '}
          |{' '}
          <a href="/terminos-servicio" className="hover:text-gray-800 transition-colors duration-200">
            Términos de Servicio
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;