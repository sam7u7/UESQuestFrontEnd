import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function PreguntasPorEncuesta() {
  const { user } = useAuth();
  const [encuestas, setEncuestas] = useState([]);
  const [tiposPregunta, setTiposPregunta] = useState([]);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    encuesta_id: '',
    id_tipo_pregunta: '',
    pregunta: '',
    ponderacion: '',
    created_by: user?.correo || ''
  });

  // Cargar encuestas y tipos de pregunta al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [encuestasRes, tiposRes] = await Promise.all([
          axios.get('/api/encuesta'),
          axios.get('/api/tipoPregunta')
        ]);
        setEncuestas(encuestasRes.data.data || []);
        setTiposPregunta(tiposRes.data.data || []);
      } catch (err) {
        setError('Error al cargar datos iniciales');
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  // Manejar cambio de encuesta seleccionada
  const handleEncuestaChange = async (e) => {
    const encuestaId = e.target.value;
    setFormData(prev => ({ ...prev, encuesta_id: encuestaId }));
    setError(null);

    if (!encuestaId) {
      setEncuestaSeleccionada(null);
      setPreguntas([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/encuesta/${encuestaId}/preguntas`);
      
      if (res.data.success) {
        setEncuestaSeleccionada(res.data.data);
        setPreguntas(res.data.data.preguntas || []);
      } else {
        setError(res.data.message || 'Error al cargar la encuesta');
      }
    } catch (err) {
      setError('Error al cargar las preguntas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await axios.post('/api/pregunta', {
        ...formData,
        created_by: user?.correo || ''
      });

      if (res.data.success) {
        // Recargar preguntas de la encuesta actual
        const encuestaRes = await axios.get(`/api/encuesta/${formData.encuesta_id}/preguntas`);
        setPreguntas(encuestaRes.data.data.preguntas || []);
        
        // Limpiar formulario
        setFormData(prev => ({
          ...prev,
          id_tipo_pregunta: '',
          pregunta: '',
          ponderacion: ''
        }));
      } else {
        setError(res.data.message || 'Error al guardar la pregunta');
      }
    } catch (err) {
      setError('Error al guardar la pregunta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Gestión de Preguntas por Encuesta</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Selector de Encuesta */}
      <div>
        <label className="block mb-2">Selecciona una encuesta:</label>
        <select
          className="border px-3 py-2 w-full"
          onChange={handleEncuestaChange}
          value={formData.encuesta_id}
          name="encuesta_id"
          disabled={loading}
        >
          <option value="">-- Selecciona --</option>
          {encuestas.map(encuesta => (
            <option key={encuesta.id} value={encuesta.id}>
              {encuesta.titulo}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Preguntas */}
      {loading && <p>Cargando...</p>}
      
      {encuestaSeleccionada && (
        <div>
          <h3 className="font-semibold text-lg">
            Preguntas de "{encuestaSeleccionada.titulo}"
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto border mt-2">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Pregunta</th>
                  <th className="border px-4 py-2">Tipo</th>
                  <th className="border px-4 py-2">Ponderación</th>
                  <th className="border px-4 py-2">Creado por</th>
                </tr>
              </thead>
              <tbody>
                {preguntas.length > 0 ? (
                  preguntas.map(pregunta => {
                    const tipo = tiposPregunta.find(t => t.id === pregunta.id_tipo_pregunta);
                    return (
                      <tr key={pregunta.id}>
                        <td className="border px-4 py-2">{pregunta.pregunta}</td>
                        <td className="border px-4 py-2">{tipo?.tipo_pregunta || '—'}</td>
                        <td className="border px-4 py-2">{pregunta.ponderacion}</td>
                        <td className="border px-4 py-2">{pregunta.created_by}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="border px-4 py-2 text-center">
                      No hay preguntas para esta encuesta
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formulario para nueva pregunta */}
      {encuestaSeleccionada && (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold text-lg">Agregar Nueva Pregunta</h3>

          <div>
            <label className="block mb-1">Tipo de pregunta:</label>
            <select
              name="id_tipo_pregunta"
              value={formData.id_tipo_pregunta}
              onChange={handleInputChange}
              className="border px-3 py-2 w-full"
              required
              disabled={loading}
            >
              <option value="">-- Selecciona --</option>
              {tiposPregunta.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.tipo_pregunta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Texto de la pregunta:</label>
            <input
              type="text"
              name="pregunta"
              value={formData.pregunta}
              onChange={handleInputChange}
              className="border px-3 py-2 w-full"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1">Ponderación:</label>
            <input
              type="number"
              name="ponderacion"
              value={formData.ponderacion}
              onChange={handleInputChange}
              className="border px-3 py-2 w-full"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Pregunta'}
          </button>
        </form>
      )}
    </div>
  );
}