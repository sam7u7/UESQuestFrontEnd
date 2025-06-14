import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const EncuestasDisponibles = () => {
  const { user } = useAuth();
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/api/mis-encuestas');
        setEncuestas(res.data.data || res.data || []);
      } catch (err) {
        setError('Error al cargar encuestas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEncuestas();
  }, []);

  const iniciarEncuesta = async (idEncuesta) => {
    if (!user?.id) {
      setError('Usuario no identificado');
      return;
    }

    try {
      setLoading(true);
      const fechaInicio = new Date().toISOString();

      // Crear registro de encuesta realizada
      const res = await axiosClient.post('/api/encuestaRealizada', {
        id_usuario: user.id,
        id_encuesta: idEncuesta,
        created_at: fechaInicio,
      });

      // Redirigir usando el ID del registro en encuesta_realizada
      navigate(`/responder-encuesta/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar encuesta');
      console.error('Error detallado:', {
        error: err,
        response: err.response,
        request: err.request,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Sin fecha límite';
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Encuestas Disponibles</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && !encuestas.length ? (
        <p>Cargando encuestas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {encuestas.map((encuesta) => (
            <div
              key={encuesta.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{encuesta.titulo}</h2>
                <p className="text-gray-600 mb-4">{encuesta.objetivo}</p>

                <div className="mb-4">
                  <h3 className="font-semibold">Indicaciones:</h3>
                  <p className="text-gray-700">
                    {encuesta.indicacion || 'No hay indicaciones específicas'}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold">Fecha límite:</h3>
                  <p className="text-gray-700">
                    {formatFecha(encuesta.fecha_fin)}
                  </p>
                </div>

                <Button
                  onClick={() => iniciarEncuesta(encuesta.id)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Iniciando...' : 'Comenzar Encuesta'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && encuestas.length === 0 && (
        <p className="text-gray-500">No hay encuestas disponibles en este momento.</p>
      )}
    </div>
  );
};

export default EncuestasDisponibles;
