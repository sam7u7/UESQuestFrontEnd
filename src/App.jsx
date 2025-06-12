import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';


// Importa los componentes de autenticación y protección
import { AuthProvider } from './context/AuthContext.jsx'; // Asegúrate de que la ruta sea correcta
import ProtectedRoute from './components/ProtectedRoute'; // Asegúrate de que la ruta sea correcta

// Importa tus componentes de página
import RolesManagementPage from './pages/RolesManagementPage';
import Usuario from './pages/usuario';
import Login from './pages/LoginPage'; // Tu componente LoginPage real
import CrearEncuesta from './pages/GestionarEncuesta.jsx';
import PreguntasBase from './pages/PreguntasBase';
import Encuestas from './pages/Encuestas'; // Tu componente Encuestas (Mis Encuestas)
import EncuestaResponder from './pages/encuestaResponder.jsx';
// Componentes de la interfaz de usuario (Header, Sidebar)
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Otros componentes de página
import GrupoMetaPage from './pages/GrupoMetaPage';
import RegistroUsuarioNuevoPage from './pages/RegistroUsuarioNuevoPage';
import GrupoUsuarioPage from './pages/GrupoUsuarioPage';
import PreguntaBaseManagementPage from './pages/PreguntaBaseManagementPage';

// Componentes para páginas de error/acceso denegado
import UnauthorizedPage from './pages/UnauthorizedPage'; // Asegúrate de crear este componente
import NotFoundPage from './pages/NotFoundPage'; // Asegúrate de crear este componente

import PreguntasEncuesta from './pages/PreguntasEncuesta.jsx';
import EncuestasDisponibles from './pages/EncuestasDisponibles.jsx';
// ==============================================================
// Componentes de ejemplo (están bien aquí, solo para ilustrar)
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    
      <AuthProvider> {/* <--- Envuelve toda la aplicación con AuthProvider */}
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
                {/* ============================================================== */}
                {/* Rutas Públicas (accesibles por todos, incluso no logueados) */}
                {/* ============================================================== */}
                <Route path="/" element={<HomePage />} />
                <Route path="/quienes-somos" element={<AboutUsPage />} />
                <Route path="/login" element={<Login />} /> {/* Tu componente Login real */}
                <Route path="/usuario-nuevo" element={<RegistroUsuarioNuevoPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} /> {/* Página de acceso denegado */}

                {/* ============================================================== */}
                {/* Rutas Protegidas (Requiere autenticación, pero no rol específico) */}
                {/* ============================================================== */}
                <Route element={<ProtectedRoute />}>
                  {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                  {/* Agrega aquí cualquier otra ruta que solo requiera que el usuario esté logueado */}
                  <Route path='/usuario' element={<Usuario/>}/>
                  <Route path="/roles" element={<RolesManagementPage />} />
                  <Route path="/grupo-meta" element={<GrupoMetaPage />} />
                  <Route path="/grupo-usuario" element={<GrupoUsuarioPage />} />
              <Route path="/pregunta-base" element={<PreguntaBaseManagementPage />} />
              // En tu archivo de rutas principal (App.jsx o similar)
                  <Route path="/encuestas/:id/preguntas" element={<PreguntasEncuesta />} /> 
                  <Route path='/encuestas/diponibles' element={<EncuestasDisponibles/>}/>
                  <Route path="/responder-encuesta/:idRealizaEncuesta" element={<EncuestaResponder />} />
                  
                </Route>

                {/* ============================================================== */}
                {/* Rutas de Encuestas (Protegidas por Rol: Solo 'admin') */}
                {/* ============================================================== */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/mis-encuestas" element={<Encuestas />} /> {/* Listado de encuestas */}
                  <Route path="/crear-encuesta" element={<CrearEncuesta />} /> {/* Crear nueva encuesta */}
                  <Route path="/crear-encuesta/preguntas" element={<PreguntasBase />} /> {/* Si PreguntasBase depende de CrearEncuesta, va aquí */}
                  
                  {/* Rutas para ver/editar encuestas específicas (ejemplos, ajusta según tu necesidad) */}
                  <Route path="/encuestas/:id" element={<Encuestas />} /> {/* Para ver una encuesta específica */}
                  <Route path="/encuestas/:id/edit" element={<CrearEncuesta />} /> {/* Usas CrearEncuesta para editar? Podría ser un EditarEncuesta dedicado */}
                </Route>

                {/* ============================================================== */}
                {/* Ruta Catch-all para 404 (Debe ser la última ruta) */}
                {/* ============================================================== */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Footer: También se desplaza con el contenido principal */}
            <footer className="bg-gray-800 text-white p-4 text-center mt-8">
              <p>© 2025 UESQuest. Todos los derechos reservados.</p>
              <p><a href="/politica-privacidad" className="hover:underline">Política de Privacidad</a> | <a href="/terminos-servicio" className="hover:underline">Términos de Servicio</a></p>
            </footer>
          </div>
        </div>
      </AuthProvider>
    
  );
}

export default App;
