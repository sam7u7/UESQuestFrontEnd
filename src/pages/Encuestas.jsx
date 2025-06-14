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
          console.warn("La respuesta de la API no es un arreglo:", receivedData);
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
    if (!fechaInicioStr || !fechaFinStr) return "N/A";

    const inicio = new Date(fechaInicioStr);
    const fin = new Date(fechaFinStr);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return "Fecha inválida";

    const diferenciaMilisegundos = fin.getTime() - inicio.getTime();
    if (diferenciaMilisegundos < 0) return "0 días (fechas invertidas)";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Encuestas</h1>
        {hasRole('admin') && (
          <Link 
            to="/crear-encuesta" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
          >
            + Crear Encuesta
          </Link>
        )}
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar encuestas por título, objetivo..."
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
                      {encuesta.usuario?.nombre || 'N/A'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {encuesta.grupo?.nombre_grupo || 'N/A'}
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
                    <div className="flex items-center justify-center space-x-3">
                      {hasRole('admin') && (
                        <>
                          <Button
                            type='button'
                            variant='secondary'
                            onClick={() => navigate(`/encuestas/${encuesta.id}/edit`)}
                            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg shadow-sm transition-all hover:shadow-md"
                          >
                            Editar
                          </Button>
                          <Button
                            type='button'
                            variant='danger'
                            onClick={() => onDeleteClick(encuesta)}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all hover:shadow-md"
                          >
                            Eliminar
                          </Button>
                          <Button
                            type='button'
                            variant='primary'
                            onClick={() => navigate(`/encuestas/${encuesta.id}/preguntas`)}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all hover:shadow-md"
                          >
                            Preguntas
                          </Button>
                          <Button 
                            onClick={() =>navigate(`/graficaBar/${encuesta.id}`)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none 
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer "
                          >
                            Graficos
                          </Button>
                          {/* <select
                            onChange={(e) => handleGraficaChange(e, encuesta.id)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                          >
                            <option value="">Gráficas ▼</option>
                            <option value="graficaPie" className="py-1">Gráfico Pie</option>
                            <option value="graficaLine" className="py-1">Gráfico Líneas</option>
                            <option value="graficaBar" className="py-1">Gráfico Barras</option>
                          </select>*/}
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