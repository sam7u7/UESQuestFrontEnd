// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa los componentes de autenticación y protección
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Importa tus componentes de página
import RolesManagementPage from './pages/RolesManagementPage';
import Usuario from './pages/usuario';
import EstadoUsuariosPage from './pages/EstadoUsuariosPage';
import Login from './pages/LoginPage';
import CrearEncuesta from './pages/GestionarEncuesta.jsx';
import PreguntasBase from './pages/PreguntasBase';
import Encuestas from './pages/Encuestas';
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
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

import PreguntasEncuesta from './pages/PreguntasEncuesta.jsx';
import EncuestasDisponibles from './pages/EncuestasDisponibles.jsx';

//graficos 
import PieChartView from './pages/PieChartView.jsx';
import BarChartView from './pages/BarChartView.jsx';
import LineChartView from './pages/LineChartView.jsx';

import QuienesSomosPage from './pages/QuienesSomosPage.jsx';



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
    <AuthProvider>
      {/* CAMBIO CLAVE AQUÍ: Hemos eliminado la clase "overflow-hidden" o la hemos cambiado a "overflow-x-hidden" */}
      {/* Es mejor simplemente quitarla si no causa problemas de scroll inesperados,
          o usar 'overflow-x-hidden' si quieres prevenir scroll horizontal por el contenido. */}
      <div className="relative"> {/* Quitamos 'overflow-hidden' */}
      {/* Opcional: <div className="relative overflow-x-hidden"> */}
        {/* Sidebar: Posicionamiento fijo, siempre visible pero con transformaciones */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* Contenedor principal que se desplaza: Incluye Header, main y footer */}
        <div
          className={`
            relative z-20 min-h-screen bg-gray-100 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'transform translate-x-64' : 'transform translate-x-0'}
            /* Ya quitamos 'lg:transform-none' y 'lg:translate-x-0' en la iteración anterior,
               lo cual es correcto para este comportamiento. */
          `}
        >
          
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />


          {/* Contenido de la página */}
          <main className="pt-20"> {/* pt-20 para dejar espacio al Header */}
            <Routes>
              {/* ============================================================== */}
              {/* Rutas Públicas (accesibles por todos, incluso no logueados) */}
              {/* ============================================================== */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/quienes-somos" element={<QuienesSomosPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
                {/*rutas para graficos  */}
                <Route path='/graficaPie/:id' element={<PieChartView/>}/>
                <Route path='/graficaLine/:id' element={<LineChartView/>}/>
                <Route path='/graficaBar/:id' element={<BarChartView/>}/>
              {/* ============================================================== */}
              {/* Rutas Protegidas (Requiere autenticación, pero no rol específico) */}
              {/* ============================================================== */}
              <Route element={<ProtectedRoute />}>
                                             
                <Route path="/usuario-nuevo" element={<RegistroUsuarioNuevoPage />} />  
                <Route path="/pregunta-base" element={<PreguntaBaseManagementPage />} />              
                <Route path="/encuestas/:id/preguntas" element={<PreguntasEncuesta />} />
                <Route path='/encuestas/diponibles' element={<EncuestasDisponibles/>}/>
                <Route path="/responder-encuesta/:idRealizaEncuesta" element={<EncuestaResponder />} />
                <Route path="/grupo-meta" element={<GrupoMetaPage />} />
                <Route path="/grupo-usuario" element={<GrupoUsuarioPage />} />
              </Route>


              {/* ============================================================== */}
              {/* Rutas de Encuestas (Protegidas por Rol: Solo 'admin') */}
              {/* ============================================================== */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/mis-encuestas" element={<Encuestas />} />
                <Route path="/crear-encuesta" element={<CrearEncuesta />} />
                <Route path="/crear-encuesta/preguntas" element={<PreguntasBase />} />
                <Route path="/encuestas/:id" element={<Encuestas />} />
                <Route path="/encuestas/:id/edit" element={<CrearEncuesta />} />
                <Route path="/roles" element={<RolesManagementPage />} />
                <Route path='/usuario' element={<Usuario/>}/>
                <Route path="/usuarios/estado" element={<EstadoUsuariosPage />} />
                
                
                
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