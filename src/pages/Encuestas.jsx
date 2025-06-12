// src/views/Encuestas.jsx
import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';
import Button from '../components/Button';
import Input from '../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

const Encuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getEncuestas();
  }, []);

  const getEncuestas = () => {
    setLoading(true);
    axiosClient.get('/api/encuestas')
      .then((response) => {
        let receivedData = response.data;
        if (receivedData && Array.isArray(receivedData.data)) {
          setEncuestas(receivedData.data);
        } else if (Array.isArray(receivedData)) {
          setEncuestas(receivedData);
        } else {
          console.warn("La respuesta de la API para /encuestas no es un arreglo o la estructura de objeto esperada:", receivedData);
          setEncuestas([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las encuestas:", error);
        setEncuestas([]);
        setLoading(false);
      });
  };

  const onDeleteClick = (encuesta) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta encuesta?")) {
      return;
    }
    axiosClient.delete(`/api/encuestas/${encuesta.id}`)
      .then(() => {
        getEncuestas();
      })
      .catch((error) => {
        console.error("Error al eliminar la encuesta:", error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const calcularDuracionEnDias = (fechaInicioStr, fechaFinStr) => {
    if (!fechaInicioStr || !fechaFinStr) {
      return "N/A";
    }

    const inicio = new Date(fechaInicioStr);
    const fin = new Date(fechaFinStr);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return "Fecha inválida";
    }

    const diferenciaMilisegundos = fin.getTime() - inicio.getTime();

    if (diferenciaMilisegundos < 0) {
      return "0 días (fechas invertidas)";
    }

    const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
    const duracionEnDias = diferenciaMilisegundos / unDiaEnMilisegundos;

    return `${Math.floor(duracionEnDias)} días`;
  };

  const filteredEncuestas = encuestas.filter(encuesta =>
    encuesta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encuesta.objetivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (encuesta.usuario && encuesta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    encuesta.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (encuesta.grupo && encuesta.grupo.nombre_grupo.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Encuestas</h1>
        {hasRole('admin') && (
          <Link to="/crear-encuesta" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Crear Encuesta
          </Link>
        )}
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar encuestas por título u objetivo..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center p-4">Cargando encuestas...</div>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Usuario</th>
                <th className="py-3 px-6 text-left">Grupo</th>
                <th className="py-3 px-6 text-left">Título</th>
                <th className="py-3 px-6 text-left">Objetivo</th>
                <th className="py-3 px-6 text-left">Indicación</th>
                <th className="py-3 px-6 text-left">Creado Por</th>
                <th className="py-3 px-6 text-left">Duración</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {filteredEncuestas.length > 0 ? (
                filteredEncuestas.map((encuesta) => (
                  <tr key={encuesta.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {encuesta.usuario?.nombre}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {encuesta.grupo?.nombre_grupo}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {encuesta.titulo}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {encuesta.objetivo}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {encuesta.indicacion}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {encuesta.created_by}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {calcularDuracionEnDias(encuesta.fecha_inicio, encuesta.fecha_fin)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {hasRole('admin') && (
                          <>
                            <Button
                              type='button'
                              variant='secondary'
                              onClick={() => navigate(`/encuestas/${encuesta.id}/edit`)}
                            >
                              Editar
                            </Button>
                            <Button
                              type='button'
                              variant='danger'
                              onClick={() => onDeleteClick(encuesta)}
                            >
                              Eliminar
                            </Button>
                            <Button
                              type='button'
                              variant='primary'
                              onClick={() => navigate(`/encuestas/${encuesta.id}/preguntas`)}
                            >
                              Preguntas
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">
                    No se encontraron encuestas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Encuestas;