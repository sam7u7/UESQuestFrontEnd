import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import axiosClient from '../axiosClient';

export default function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [message, setMessage] = useState(''); // Para mensajes de éxito o información

  const navigate = useNavigate(); // Hook para la navegación

  // Efecto para redirigir después de un inicio de sesión exitoso
  useEffect(() => {
    if (onLoginSuccess) {
      // onLoginSuccess debería ser una función que se llama cuando el login es exitoso
      // y que en el componente padre, por ejemplo, actualiza el estado de autenticación.
      // Aquí, asumimos que si onLoginSuccess se ejecuta, la redirección a /home es deseada.
      // Podrías pasar el usuario autenticado a onLoginSuccess para que el padre lo maneje.
    }
  }, [onLoginSuccess]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(''); // Limpiar mensajes previos

    try {
      const response = await axiosClient.post('/api/login', { correo, password });

      const token = response.data.token;

      if (!token) {
        setError('No se recibió un token válido');
        return;
      }

      localStorage.setItem('authToken', token);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Obtener información del usuario autenticado
      const userResponse = await axiosClient.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Llama a la función onLoginSuccess pasada por el padre
      // y luego redirige a la página de inicio.
      if (onLoginSuccess) {
        onLoginSuccess(userResponse.data);
      }
      navigate('/home'); // Redirige a la página de inicio
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      if (err.response && err.response.data) {
        const backendError = err.response.data.message;
        if (backendError === 'Cuenta bloqueada. Se ha enviado una nueva contraseña a su correo.') {
          setError(backendError);
          setMessage('Por favor, revise su correo electrónico para la nueva contraseña.');
        } else if (backendError === 'Credenciales inválidas. Intentos restantes: 2' ||
                   backendError === 'Credenciales inválidas. Intentos restantes: 1') {
          setError(backendError);
        } else {
          setError('Credenciales inválidas');
        }
      } else {
        setError('Error al intentar iniciar sesión. Por favor, intente de nuevo.');
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(''); // Limpiar mensajes previos

    try {
      // Llama a la nueva ruta de Laravel para restablecer la contraseña
      await axiosClient.post('/api/forgot-password', { correo: forgotPasswordEmail });
      setMessage('Si su correo está registrado, recibirá una contraseña provisional en su bandeja de entrada.');
      setShowForgotPasswordForm(false); // Ocultar el formulario después de enviar
      setForgotPasswordEmail(''); // Limpiar el campo
    } catch (err) {
      console.error('Error al solicitar restablecimiento de contraseña:', err);
      setError('Error al procesar su solicitud. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 shadow-md rounded-2xl mt-16">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Inicio de sesión</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

      {!showForgotPasswordForm ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors rounded-md"
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setShowForgotPasswordForm(true)}
            className="w-full text-sm text-gray-600 hover:text-gray-800 mt-2 rounded-md"
          >
            Olvidé mi contraseña
          </button>
        </form>
      ) : (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-sm text-gray-700">Introduce tu correo para restablecer la contraseña:</p>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors rounded-md"
          >
            Enviar contraseña provisional
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForgotPasswordForm(false);
              setError('');
              setMessage('');
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-800 mt-2 rounded-md"
          >
            Volver al inicio de sesión
          </button>
        </form>
      )}
    </div>
  );
}
