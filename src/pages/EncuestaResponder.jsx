import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';

const EncuestaResponder = () => {
  const { idRealizaEncuesta } = useParams();
  const navigate = useNavigate();

  const [encuesta, setEncuesta] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [textosMixtos, setTextosMixtos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const realizadaRes = await axiosClient.get(`/api/encuestaRealizada/${idRealizaEncuesta}`);
        const idEncuesta = realizadaRes.data.id_encuesta;

        const encuestaRes = await axiosClient.get(`/api/encuestaPreguntaForm/${idEncuesta}`);
        setEncuesta(encuestaRes.data);
        setPreguntas(encuestaRes.data.preguntas || []);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la encuesta.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idRealizaEncuesta]);

  const handleChange = (preguntaId, respuestaId, multiple) => {
    setRespuestas(prev => {
      const prevResp = prev[preguntaId] || [];
      return {
        ...prev,
        [preguntaId]: multiple
          ? prevResp.includes(respuestaId)
            ? prevResp.filter(id => id !== respuestaId)
            : [...prevResp, respuestaId]
          : [respuestaId],
      };
    });
  };

  const handleTextoMixto = (preguntaId, value) => {
    setTextosMixtos(prev => ({
      ...prev,
      [preguntaId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();

    try {
      const payload = [];

      preguntas.forEach(pregunta => {
        const respuestaIds = respuestas[pregunta.id] || [];
        const textoMixto = textosMixtos[pregunta.id] || null;
        const tipo = pregunta.tipo_preguntas?.[0]?.tipo_pregunta;

        respuestaIds.forEach(idRespuesta => {
          payload.push({
            id_realiza_encuesta: idRealizaEncuesta,
            id_pregunta: pregunta.id,
            id_respuesta: idRespuesta,
            respuesta_texto: textoMixto,
            created_at: timestamp,
            updated_at: timestamp,
          });
        });

        if (
          (respuestaIds.length === 0 || tipo === 'Mixta') &&
          textoMixto
        ) {
          payload.push({
            id_realiza_encuesta: idRealizaEncuesta,
            id_pregunta: pregunta.id,
            id_respuesta: null,
            respuesta_texto: textoMixto,
            created_at: timestamp,
            updated_at: timestamp,
          });
        }
      });

      await axiosClient.post('/api/respuestasUsuario', payload);
      navigate('/');
    } catch (err) {
      console.error('Error al enviar respuestas:', err);
      setError('Error al enviar respuestas.');
    }
  };

  const renderPregunta = (pregunta, tipo) => {
    const respuestasSeleccionadas = respuestas[pregunta.id] || [];
    const opciones = pregunta.tipo_respuestas || [];

    switch (tipo) {
      case 'Dicotómica':
      case 'Polítomica':
        return opciones.map(respuesta => (
          <label key={respuesta.id} className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name={`pregunta-${pregunta.id}`}
              value={respuesta.id}
              checked={respuestasSeleccionadas.includes(respuesta.id)}
              onChange={() => handleChange(pregunta.id, respuesta.id, false)}
              className="accent-blue-600"
            />
            {respuesta.respuesta}
          </label>
        ));

      case 'Multiple':
        return opciones.map(respuesta => (
          <label key={respuesta.id} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              name={`pregunta-${pregunta.id}`}
              value={respuesta.id}
              checked={respuestasSeleccionadas.includes(respuesta.id)}
              onChange={() => handleChange(pregunta.id, respuesta.id, true)}
              className="accent-blue-600"
            />
            {respuesta.respuesta}
          </label>
        ));

      case 'Ranking':
        return (
          <select
            className="mt-2 w-full p-2 border rounded"
            value={respuestasSeleccionadas[0] || ''}
            onChange={e => handleChange(pregunta.id, parseInt(e.target.value), false)}
          >
            <option value="">Seleccione una opción</option>
            {opciones.map(respuesta => (
              <option key={respuesta.id} value={respuesta.id}>
                {respuesta.respuesta}
              </option>
            ))}
          </select>
        );

      case 'Escala':
      case 'Likert':
        return (
          <div className="flex gap-4 mt-2">
            {opciones.map(respuesta => (
              <label key={respuesta.id} className="flex flex-col items-center text-sm">
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={respuesta.id}
                  checked={respuestasSeleccionadas.includes(respuesta.id)}
                  onChange={() => handleChange(pregunta.id, respuesta.id, false)}
                />
                {respuesta.respuesta}
              </label>
            ))}
          </div>
        );

      case 'Numerica':
        return (
          <input
            type="number"
            className="mt-2 w-full p-2 border rounded"
            value={textosMixtos[pregunta.id] || ''}
            onChange={(e) => handleTextoMixto(pregunta.id, e.target.value)}
          />
        );

      case 'Mixta':
        return (
          <>
            {opciones.map(respuesta => (
              <label key={respuesta.id} className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={respuesta.id}
                  checked={respuestasSeleccionadas.includes(respuesta.id)}
                  onChange={() => handleChange(pregunta.id, respuesta.id, false)}
                  className="accent-blue-600"
                />
                {respuesta.respuesta}
              </label>
            ))}
            <input
              type="text"
              placeholder="Escriba su respuesta"
              className="mt-2 w-full p-2 border rounded"
              name={`respuesta_texto-${pregunta.id}`}
              value={textosMixtos[pregunta.id] || ''}
              onChange={(e) => handleTextoMixto(pregunta.id, e.target.value)}
            />
          </>
        );

      default:
        return <p className="text-red-500">Tipo de pregunta no soportado.</p>;
    }
  };

  if (loading) return <div className="p-6">Cargando encuesta...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!encuesta) return <div className="p-6">Encuesta no encontrada.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{encuesta[0].titulo}</h1>
      <p className="text-gray-700 mb-4">{encuesta[0].objetivo}</p>
      <p className="italic text-gray-600 mb-6">{encuesta[0].indicacion}</p>

      <form onSubmit={handleSubmit}>
        {preguntas.map((pregunta, index) => {
          const tipo = pregunta.tipo_preguntas?.[0]?.tipo_pregunta || 'Desconocido';

          return (
            <div key={pregunta.id} className="mb-6 border-b pb-4">
              <h2 className="font-semibold text-lg">{index + 1}. {pregunta.pregunta}</h2>
              <p className="text-sm text-gray-600 mb-2">{pregunta.tipo_preguntas?.[0]?.indicacion}</p>
              {renderPregunta(pregunta, tipo)}
            </div>
          );
        })}

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Enviar Respuestas
        </button>
      </form>
    </div>
  );
};

export default EncuestaResponder;
