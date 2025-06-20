// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient'; // Asegúrate de que la ruta a axiosClient sea correcta

// 1. Inicializar createContext con null para JavaScript puro.
//    Esto significa que `context` será `null` si no hay un Provider.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null); // Aquí guardaremos el objeto completo del usuario (incluyendo roles)
  const [loadingAuth, setLoadingAuth] = useState(true); // Para saber si la autenticación inicial ha terminado

  // Función para obtener el encabezado de autenticación
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // No redirigimos aquí directamente para que ProtectedRoute pueda manejarlo
      return {}; 
    }
    setAuthToken(token);
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    };
  }, []);

  // Función para decodificar el token o obtener información del usuario
  const fetchUser = useCallback(async (token) => {
    try {
      // Si tu backend tiene un endpoint para obtener el usuario actual
      const response = await axiosClient.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data); 
      setIsAuthenticated(true);
      return response.data; // Retorna el usuario para verificar roles
    } catch (error) {
      console.error("Failed to fetch user data or token is invalid:", error);
      logout(); // Si falla al obtener el usuario, cerrar sesión
      return null;
    }
  }, []); // Dependencias: no necesita más que las variables internas del ámbito

  const login = async (token, userData = null) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    } else {
      
      await fetchUser(token);
    }
    navigate('/home'); // Redirige a la página principal después del login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirigir al login después del logout
  };

  // Verificar autenticación y obtener roles al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(token).finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false); // No hay token, termina la carga de autenticación
    }
  }, [fetchUser]); // Dependencia del useCallback fetchUser

  // Función de utilidad para verificar si el usuario tiene un rol específico
  const hasRole = useCallback((roleName) => {
  if (!user) return false;

  // Mapeo de nombre de rol a ID
  const roleMap = {
    admin: 1,
    usuario: 2,
  };

  return roleMap[roleName] === user.id_rol;
  }, [user]);

  // El valor que estará disponible para todos los consumidores del contexto
  const authContextValue = {
    isAuthenticated,
    authToken,
    user,
    loadingAuth, // Exportar el estado de carga
    getAuthHeader,
    login,
    logout,
    hasRole, // Exportar la función para verificar roles
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  // La comprobación ahora es para `null` en lugar de `undefined`.
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
