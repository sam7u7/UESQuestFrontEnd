// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Importa el hook de tu contexto


const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loadingAuth, hasRole } = useAuth();

  // Muestra un cargador mientras se verifica la autenticación
  if (loadingAuth) {
    return <div>Cargando autenticación...</div>; 
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si está autenticado, verificar si tiene el rol permitido
  if (allowedRoles && !allowedRoles.some(roles => hasRole(roles))) {
    // Si no tiene el rol, redirigir a una página de "Acceso Denegado" o al dashboard
    // Podrías mostrar un mensaje de alerta aquí también
    return <Navigate to="/unauthorized" replace />; // Crea una página para esto
  }

  // Si pasa ambas verificaciones, renderiza las rutas anidadas
  return <Outlet />;
};

export default ProtectedRoute;