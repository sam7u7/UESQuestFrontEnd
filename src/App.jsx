// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RolesManagementPage from './pages/RolesManagementPage';
import Usuario from './pages/usuario';
import Login from './pages/LoginPage';
import CrearEncuesta from './pages/CrearEncuesta'; // Importa el componente CrearEncuesta
import PreguntasBase from './pages/PreguntasBase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GrupoMetaPage from './pages/GrupoMetaPage';
import RegistroUsuarioNuevoPage from './pages/RegistroUsuarioNuevoPage';
import GrupoUsuarioPage from './pages/GrupoUsuarioPage';
import PreguntaBaseManagementPage from './pages/PreguntaBaseManagementPage';


// ==============================================================
// DEFINE TODOS TUS COMPONENTES DE EJEMPLO AQUÍ ARRIBA
// (Asegúrate de que estén definidos para evitar ReferenceError)
// ==============================================================
const HomePage = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4">Bienvenido a UESQuest</h1>
    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
      Tu plataforma para crear encuestas y gestionar roles.
    </p>
    <div className="h-[1000px] bg-gray-50 mt-10 flex items-center justify-center text-gray-400">
        Mucho contenido de ejemplo para hacer scroll...
    </div>
  </div>
);

const AboutUsPage = () => (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">¿Quiénes Somos?</h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Somos un equipo dedicado a facilitar la creación y gestión de encuestas.
      </p>
    </div>
);

const LoginPage = () => (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Iniciar Sesión</h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Próximamente formulario de inicio de sesión.
      </p>
    </div>
);



const MySurveysPage = () => (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Mis Encuestas</h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        Visualiza y gestiona tus encuestas existentes.
      </p>
    </div>
);


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    
      <div className="relative overflow-hidden">
        {/* Sidebar: Posicionamiento fijo, siempre visible pero con transformaciones */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* Contenedor principal que se desplaza: Incluye Header, main y footer */}
        <div
          className={`
            relative z-20 min-h-screen bg-gray-100 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'transform translate-x-64' : 'transform translate-x-0'}
            lg:transform-none lg:translate-x-0 // En desktop, no hay transformación
          `}
        >
          {/* Header: Ahora NO ES FIXED aquí, se mueve con el contenedor padre */}
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

          {/* Contenido de la página */}
          <main className="pt-20"> {/* pt-20 para dejar espacio al Header */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quienes-somos" element={<AboutUsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/crear-encuesta" element={<CrearEncuesta />} />
              <Route path="/crear-encuesta/preguntas" element={<PreguntasBase />} />
              <Route path="/mis-encuestas" element={<MySurveysPage />} />
              <Route path="/roles" element={<RolesManagementPage />} />
              <Route path="/grupo-meta" element={<GrupoMeta />} />
              <Route path='/usuario' element={<Usuario/>}/>
              <Route path="/grupo-meta" element={<GrupoMetaPage />} />
              <Route path="/usuario-nuevo" element={<RegistroUsuarioNuevoPage />} />
              <Route path="/grupo-usuario" element={<GrupoUsuarioPage />} />
              <Route path="/pregunta-base" element={<PreguntaBaseManagementPage />} />
              <Route path="*" element={<div className="text-center py-20"><h1>404 - Página no encontrada</h1><p>Verifica la URL.</p></div>} />
            </Routes>
          </main>

          {/* Footer: También se desplaza con el contenido principal */}
          <footer className="bg-gray-800 text-white p-4 text-center mt-8">
            <p>© 2025 UESQuest. Todos los derechos reservados.</p>
            <p><a href="/politica-privacidad" className="hover:underline">Política de Privacidad</a> | <a href="/terminos-servicio" className="hover:underline">Términos de Servicio</a></p>
          </footer>
        </div>
      </div>
    
  );
}

export default App;