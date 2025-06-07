import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AlertMessage from '../components/AlertMessage';
import { useNavigate } from 'react-router-dom';

function PreguntaBaseManagementPage() {
  const [preguntas, setPreguntas] = useState([]);
  const [formData, setFormData] = useState({
    encuesta_id: '',
    id_tipo_pregunta: '',
    pregunta: '',
    ponderacion: '',
    created_by: ''
  });
  const [editPregunta, setEditPregunta] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [encuestas, setEncuestas] = useState([]);
  const [tiposPregunta, setTiposPregunta] = useState([]);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlert({ message: 'No estás autenticado.', type: 'error' });
      navigate('/login');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchPreguntas();
      fetchEncuestas();
      fetchTiposPregunta();
    }
  }, []);

  const fetchPreguntas = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/api/preguntaBase', getAuthHeader());
      setPreguntas(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Error al cargar preguntas.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEncuestas = async () => {
    try {
      const res = await axiosClient.get('/api/encuestas', getAuthHeader());
      setEncuestas(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Error al cargar encuestas.', type: 'error' });
    }
  };

  const fetchTiposPregunta = async () => {
    try {
      const res = await axiosClient.get('/api/tipoPregunta', getAuthHeader());
      setTiposPregunta(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Error al cargar tipos de pregunta.', type: 'error' });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        ponderacion: parseFloat(formData.ponderacion)
      };

      if (editPregunta) {
        await axiosClient.put(`/api/preguntaBase/${editPregunta.id}`, payload, getAuthHeader());
        setAlert({ message: 'Pregunta actualizada.', type: 'success' });
      } else {
        await axiosClient.post('/api/preguntaBase', payload, getAuthHeader());
        setAlert({ message: 'Pregunta creada.', type: 'success' });
      }

      setFormData({
        encuesta_id: '',
        id_tipo_pregunta: '',
        pregunta: '',
        ponderacion: '',
        created_by: ''
      });
      setEditPregunta(null);
      fetchPreguntas();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Error al guardar la pregunta.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pregunta) => {
    setFormData({ ...pregunta });
    setEditPregunta(pregunta);
    setAlert({ message: 'Editando pregunta...', type: 'info' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;

    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/preguntaBase/${id}`, getAuthHeader());
      setAlert({ message: 'Pregunta eliminada.', type: 'success' });
      fetchPreguntas();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Error al eliminar.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPreguntas = useMemo(() => {
    return preguntas.filter(p =>
      p.pregunta.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [preguntas, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card title="Gestión de Preguntas Base">
        {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

        <form onSubmit={handleSubmit} className="mb-4 space-y-4">
          <div>
            <label htmlFor="encuesta_id" className="block mb-1 font-medium">Encuesta</label>
            <select
              name="encuesta_id"
              value={formData.encuesta_id}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona una encuesta</option>
              {encuestas.map(e => (
                <option key={`encuesta-${e.id}`} value={e.id}>{e.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="id_tipo_pregunta" className="block mb-1 font-medium">Tipo de Pregunta</label>
            <select
              name="id_tipo_pregunta"
              value={formData.id_tipo_pregunta}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona un tipo</option>
              {tiposPregunta.map(tp => (
                <option key={`tipo-${tp.tipo_pregunta}`} value={tp.id}>
  {tp.tipo_pregunta}
</option>

              ))}
            </select>
          </div>

          <InputField label="Pregunta" name="pregunta" value={formData.pregunta} onChange={handleChange} required />
          <InputField label="Ponderación" name="ponderacion" type="number" value={formData.ponderacion} onChange={handleChange} required />
          <InputField label="Creado por" name="created_by" value={formData.created_by} onChange={handleChange} required />

          <Button type="submit" variant="primary" disabled={isLoading}>
            {editPregunta ? 'Actualizar Pregunta' : 'Crear Pregunta'}
          </Button>
        </form>

        <InputField label="Buscar Pregunta" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        {!isLoading && filteredPreguntas.length === 0 ? (
          <p>No hay preguntas disponibles.</p>
        ) : (
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr>
                <th className="border p-2 text-left">Encuesta</th>
                <th className="border p-2 text-left">Tipo</th>
                <th className="border p-2 text-left">Pregunta</th>
                <th className="border p-2 text-left">Ponderación</th>
                <th className="border p-2 text-left">Creado por</th>
                <th className="border p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPreguntas.map(p => {
                const encuesta = encuestas.find(e => e.id === p.encuesta_id);
                const tipo = tiposPregunta.find(t => t.id_tipo_pregunta === p.tipo_pregunta);

                return (
                  <tr key={p.id}>
                    <td className="border p-2">{encuesta ? encuesta.titulo : 'N/D'}</td>
                    <td className="border p-2">{tipo ? tipo.tipo_pregunta : 'N/D'}</td>
                    <td className="border p-2">{p.pregunta}</td>
                    <td className="border p-2">{p.ponderacion}</td>
                    <td className="border p-2">{p.created_by}</td>
                    <td className="border p-2 space-x-2">
                      <Button onClick={() => handleEdit(p)}>Editar</Button>
                      <Button onClick={() => handleDelete(p.id)}>Eliminar</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default PreguntaBaseManagementPage;


