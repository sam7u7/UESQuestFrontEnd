import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Opcional, para estado de autenticación

  // Función para obtener los headers de autenticación
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Aquí podrías usar un contexto para mostrar alertas globales si tuvieras uno
      // setAlert({ message: 'No estás autenticado.', type: 'error' });
      navigate('/login');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    };
  }, [navigate]);

  // Efecto para verificar la autenticación al inicio o al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      // Aquí podrías llamar a fetchRoles si fuera necesario al verificar la autenticación
      // Por ejemplo, si los roles son necesarios para la navegación inicial
    }
  }, [navigate]);

  // Funciones para login y logout (ejemplos)
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    navigate('HomePage'); // Redirigir después de login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login'); // Redirigir después de logout
  };

  return { getAuthHeader, isAuthenticated, login, logout };
};

export default useAuth;