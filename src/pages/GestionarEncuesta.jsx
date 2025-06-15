import React, { useState, useEffect } from 'react';
import axiosClient from '../axiosClient.js';
import Button from '../components/Button.jsx';
import Input from '../components/InputField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate
import ErrorMenssage from '../components/ErrorMessage.jsx'
import LoadingSpin from '../components/LoadingSpinner.jsx'
import NotFound from '../components/NoDataFound.jsx'

// Componente para crear y editar encuestas
const GestionarEncuesta = () => { // Considera renombrar el componente
  // Estado para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [indicacion, setIndicacion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idGrupo, setIdGrupo] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();
  const { id } = useParams(); // Obtiene el ID de la URL (si existe)
  const navigate = useNavigate(); // Para redirigir después de guardar/actualizar

  // Determinar si estamos en modo edición o creación
  const isEditing = !!id; // True si existe un ID en la URL

  // Carga de grupos (permanece igual)
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axiosClient.get('/api/grupoMeta');
        setGrupos(response.data);
      } catch (error) {
        console.error('Error al cargar los grupos:', error);
        setMessage({ type: 'error', text: 'Error al cargar los grupos. Inténtalo de nuevo.' });
      }
    }
    fetchGrupos();
  }, []);

  // Cargar datos de la encuesta si estamos en modo edición
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axiosClient.get(`/api/encuestas/${id}`)
        .then(({ data }) => {
          // Asegúrate de que los nombres de los campos coincidan con los de tu API
          setTitulo(data.titulo || '');
          setIndicacion(data.indicacion || '');
          setObjetivo(data.objetivo || '');
          setFechaInicio(data.fecha_inicio || ''); // Formato 'YYYY-MM-DD'
          setFechaFin(data.fecha_fin || '');     // Formato 'YYYY-MM-DD'
          setIdGrupo(data.id_grupo ? data.id_grupo.toString() : ''); // Asegúrate de que sea string para el select
          
        })
        .catch(error => {
          console.error("Error al cargar la encuesta para editar:", error);
          setMessage({ type: 'error', text: 'Error al cargar los datos de la encuesta. Inténtalo de nuevo.' });
          navigate('/encuestas'); // Redirigir si la encuesta no se encuentra
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing, navigate]); // Dependencias para useEffect

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validaciones básicas
    if (!titulo || !indicacion || !objetivo || !fechaInicio || !fechaFin || !idGrupo) {
      setMessage({ type: 'error', text: 'Por favor, completa todos los campos obligatorios.' });
      setLoading(false);
      return;
    }

    const dataToSend = {
      // id_usuario: idUsuario, // Normalmente, el backend debería saber el usuario autenticado
      id_grupo: parseInt(idGrupo),
      titulo: titulo,
      indicacion: indicacion,
      objetivo: objetivo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      created_by: user['correo'] // Si es necesario actualizar 'created_by'
    };

    try {
      let response;
      if (isEditing) {
        // Si estamos editando, hacemos una solicitud PUT/PATCH
        response = await axiosClient.put(`/api/encuestas/${id}`, dataToSend);
        setMessage({ type: 'success', text: response.data.message || 'Encuesta actualizada exitosamente.' });
      } else {
        // Si estamos creando, hacemos una solicitud POST
        // Asegúrate de que id_usuario sea el ID del usuario autenticado, no un valor fijo como '1'
        // Lo ideal es que tu backend lo obtenga de la sesión del usuario.
        response = await axiosClient.post('/api/encuestas', { ...dataToSend, id_usuario: user.id }); // Envía el id_usuario al crear
        setMessage({ type: 'success', text: response.data.message || 'Encuesta creada exitosamente.' });
      }

      // Opcional: Redirigir al usuario a la lista de encuestas después de éxito
      navigate('/mis-encuestas');

    } catch (error) {
      console.error('Error al guardar la encuesta:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la encuesta. Por favor, inténtalo de nuevo.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg border border-blue-200 p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-8">
          {isEditing ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}
        </h1>

        {/* Contenedor de mensajes (éxito/error) */}
        {message.text && (
          <div className={`p-3 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Título de la encuesta */}
          <div className="mb-6">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la encuesta: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full text-xl sm:text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-2 rounded-lg"
              placeholder="Escribe el título aquí"
              required
            />
          </div>

          {/* Indicaciones para el encuestado */}
          <div className="mb-6">
            <label htmlFor="indicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Indicaciones para el encuestado: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="indicacion"
              value={indicacion}
              onChange={(e) => setIndicacion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
              placeholder="Escribe aquí las indicaciones que deben seguir los encuestados"
              rows="4"
              required
            />
          </div>

          {/* OBJETIVO DE LA ENCUESTA */}
          <div className="mb-6">
            <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo de la encuesta: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
              placeholder="Describe el objetivo principal de esta encuesta"
              rows="3"
              required
            />
          </div>

          {/* Selector de Grupo */}
          <div className="mb-6">
            <label htmlFor="id_grupo" className="block text-sm font-medium text-gray-700 mb-1">
              Grupo de destino: <span className="text-red-500">*</span>
            </label>
            <select
              id="id_grupo"
              value={idGrupo}
              onChange={(e) => setIdGrupo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              {grupos.length === 0 ? (
                <option value="">Cargando grupos...</option>
              ) : (
                <>
                  <option value="">Selecciona un grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nombre_grupo}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Fechas de inicio y fin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="fecha_inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="fecha_fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mt-10">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {isEditing ? 'Actualizar Encuesta' : 'Crear Encuesta'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GestionarEncuesta; // Asegúrate de exportar el nombre del componente si lo cambiaste