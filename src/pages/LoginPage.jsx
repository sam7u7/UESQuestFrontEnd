import { useState } from 'react';

import axiosClient from '../axiosClient';

export default function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Realizar la autenticación y obtener el token
      const response = await axiosClient.post('/api/login', { correo, password });

      const token = response.data.token;
      
      if (!token) {
        setError('No se recibió un token válido');
        return;
      }

      // Guardar el token en localStorage
      localStorage.setItem('authToken', token);

      // Configurar el token para futuras solicitudes en Axios
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Obtener información del usuario autenticado
      const userResponse = await axiosClient.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      onLoginSuccess && onLoginSuccess(userResponse.data);
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 shadow-md rounded-2xl mt-16">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Inicio de sesión</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
