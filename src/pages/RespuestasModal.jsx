import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import Button from '../components/Button';
import Input from '../components/InputField';

const RespuestasModal = ({ preguntaId, tipoPregunta, userEmail, onClose }) => {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    respuesta: '',
    correcta: false,
    orden: 0,
    created_by: userEmail
  });

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/api/tipoRespuesta/respuesta/${preguntaId}`);
        
        // Manejar diferentes formatos de respuesta
        let respuestasData = [];
        if (Array.isArray(res.data)) {
          respuestasData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          respuestasData = res.data.data;
        } else if (res.data && res.data.respuestas) {
          respuestasData = res.data.respuestas;
        }
        
        setRespuestas(respuestasData);
      } catch (err) {
        setError('Error al cargar respuestas');
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRespuestas();
  }, [preguntaId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Preparar los datos para enviar
      const payload = {
        ...form,
        id_pregunta: preguntaId,
        orden: parseInt(form.orden) || 0,
        correcta: Boolean(form.correcta)
      };

      const res = await axiosClient.post('/api/tipoRespuesta', payload);
      
      // Actualizar la lista de respuestas
      const updatedRespuestas = await axiosClient.get(`/api/tipoRespuesta/respuesta/${preguntaId}`);
      setRespuestas(updatedRespuestas.data?.data || updatedRespuestas.data || []);
      
      // Resetear el formulario
      setForm({
        respuesta: '',
        correcta: false,
        orden: 0,
        created_by: userEmail
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar respuesta');
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRespuesta = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta respuesta?")) return;
    
    try {
      await axiosClient.delete(`/api/tipoRespuesta/${id}`);
      setRespuestas(respuestas.filter(r => r.id !== id));
    } catch (err) {
      setError('Error al eliminar respuesta');
      console.error('Error:', err.response?.data || err.message);
    }
  };

  const renderFormByType = () => {
    switch(tipoPregunta?.toLowerCase()) {
      case 'dicotómica':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="respuesta_si"
                name="respuesta"
                value="Sí"
                checked={form.respuesta === "Sí"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="respuesta_si">Sí</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="respuesta_no"
                name="respuesta"
                value="No"
                checked={form.respuesta === "No"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="respuesta_no">No</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="correcta"
                name="correcta"
                checked={form.correcta}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="correcta">Correcta</label>
            </div>
          </div>
        );
      
      case 'polítomica':
      case 'mixta':
      case 'multiple':
        return (
          <div className="space-y-4">
            <Input
              type="text"
              name="respuesta"
              value={form.respuesta}
              onChange={handleChange}
              placeholder="Texto de la opción"
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="correcta"
                checked={form.correcta}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Correcta</label>
            </div>
            <Input
              type="number"
              name="orden"
              value={form.orden}
              onChange={handleChange}
              placeholder="Orden"
              required
              min="0"
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <Input
              type="text"
              name="respuesta"
              value={form.respuesta}
              onChange={handleChange}
              placeholder="Texto de la respuesta"
              required
            />
            <Input
              type="number"
              name="orden"
              value={form.orden}
              onChange={handleChange}
              placeholder="Orden"
              required
              min="0"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <h3 className="font-semibold text-lg">Respuestas existentes</h3>
      
      {loading ? (
        <p>Cargando respuestas...</p>
      ) : (
        <div className="max-h-60 overflow-y-auto mb-4 border rounded">
          {respuestas.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Respuesta</th>
                  <th className="p-2 text-center">Correcta</th>
                  <th className="p-2 text-center">Orden</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {respuestas.map(respuesta => (
                  <tr key={respuesta.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{respuesta.respuesta}</td>
                    <td className="p-2 text-center">{respuesta.correcta ? '✓' : '✗'}</td>
                    <td className="p-2 text-center">{respuesta.orden}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteRespuesta(respuesta.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500 text-center">No hay respuestas registradas</p>
          )}
        </div>
      )}

      <h3 className="font-semibold text-lg">Agregar nueva respuesta</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderFormByType()}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cerrar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Respuesta'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RespuestasModal;