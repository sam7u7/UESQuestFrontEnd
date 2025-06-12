import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal';
import RespuestasModal from './RespuestasModal';

const PreguntasEncuesta = () => {
  const { id } = useParams();
  const { user, hasRole } = useAuth();
  const navigate = useNavigate()
  const [data, setData] = useState({
    encuesta: null,
    preguntas: [],
    tipos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    show: false,
    preguntaId: null,
    tipo: null
  });
  const [form, setForm] = useState({
    pregunta: '',
    id_tipo_pregunta: '',
    ponderacion: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [encuesta, preguntas, tipos] = await Promise.all([
          axiosClient.get(`/api/encuestas/${id}`),
          axiosClient.get(`/api/encuestaPregunta/${id}`),
          axiosClient.get('/api/tipoPregunta')
        ]);
        
        setData({
          encuesta: encuesta.data,
          preguntas: preguntas.data?.preguntas || preguntas.data || [],
          tipos: tipos.data || []
        });
      } catch (err) {
        setError('Error al cargar datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.post('/api/preguntaBase', {
        ...form,
        encuesta_id: id,
        created_by: user.correo
      });
      
      const res = await axiosClient.get(`/api/encuestaPregunta/${id}`);
      setData(prev => ({
        ...prev,
        preguntas: res.data?.preguntas || res.data || []
      }));
      
      setForm({
        pregunta: '',
        id_tipo_pregunta: '',
        ponderacion: ''
      });
    } catch (err) {
      setError('Error al guardar pregunta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePregunta = async (idPregunta) => {
    if (!window.confirm("¿Eliminar esta pregunta?")) return;
    
    try {
      await axiosClient.delete(`/api/preguntaBase/${idPregunta}`);
      setData(prev => ({
        ...prev,
        preguntas: prev.preguntas.filter(p => p.id !== idPregunta)
      }));
    } catch (err) {
      setError('Error al eliminar');
      console.error(err);
    }
  };

  const openRespuestasModal = (preguntaId, tipoId) => {
    const tipo = data.tipos.find(t => t.id === tipoId);
    setModal({
      show: true,
      preguntaId,
      tipo: tipo?.tipo_pregunta || 'Desconocido'
    });
  };

  if (loading && !data.encuesta) return <div className="p-6">Cargando...</div>;
  if (!data.encuesta) return <div className="p-6">Encuesta no encontrada</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Preguntas: {data.encuesta.titulo}</h1>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Pregunta</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Ponderación</th>
              {hasRole('admin') && <th className="p-3 text-left">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {data.preguntas.map(pregunta => {
              const tipo = data.tipos.find(t => t.id === pregunta.id_tipo_pregunta);
              return (
                <tr key={pregunta.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{pregunta.pregunta}</td>
                  <td className="p-3">{tipo?.tipo_pregunta || 'Desconocido'}</td>
                  <td className="p-3">{pregunta.ponderacion}</td>
                  {hasRole('admin') && (
                    <td className="p-3 space-x-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deletePregunta(pregunta.id)}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openRespuestasModal(pregunta.id, pregunta.id_tipo_pregunta)}
                        disabled={loading}
                      >
                        Respuestas
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasRole('admin') && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Agregar Pregunta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Pregunta:</label>
              <input
                type="text"
                name="pregunta"
                value={form.pregunta}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1">Tipo:</label>
              <select
                name="id_tipo_pregunta"
                value={form.id_tipo_pregunta}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              >
                <option value="">Seleccione tipo</option>
                {data.tipos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.tipo_pregunta}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Ponderación:</label>
              <input
                type="number"
                name="ponderacion"
                value={form.ponderacion}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Pregunta'}
            </Button>
          </form>
        </div>
      )}

      <Modal
        isOpen={modal.show}
        onClose={() => setModal({ show: false, preguntaId: null, tipo: null })}
        title={`Respuestas (${modal.tipo})`}
      >
        {modal.show && (
          <RespuestasModal
            preguntaId={modal.preguntaId}
            tipoPregunta={modal.tipo}
            userEmail={user?.correo}
            onClose={() => setModal({ show: false, preguntaId: null, tipo: null })}
          />
        )}
      </Modal>
    </div>
  );
};

export default PreguntasEncuesta;