import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import ExportButtons from "../components/ExportButtons";

const BarChartView = () => {
  const { id } = useParams();
  const [encuestaData, setEncuestaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencias para los gráficos
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const lineChartRef = useRef();

  useEffect(() => {
    if (id) {
      const fetchSurveyData = async () => {
        setLoading(true);
        setError(null);
        try {
          const preguntasResponse = await axiosClient.get(`/api/Encuestas/datos/${id}`);
          setEncuestaData(preguntasResponse.data);
        } catch (error) {
          console.error("ERROR: Error al cargar los datos de la encuesta:", error);
          setError("No se pudieron cargar los datos de la encuesta. Inténtalo de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      };
      fetchSurveyData();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!encuestaData) return <div className="min-h-screen flex items-center justify-center">No se encontraron datos.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de la encuesta */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {encuestaData.titulo}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6 border-b pb-4 border-gray-200">
            {encuestaData.objetivo}
          </h2>
          <h3 className="text-lg md:text-xl font-normal text-gray-600 italic">
            {encuestaData.indicacion}
          </h3>
        </div>

        {/* Gráficos y controles de exportación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Barras */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Gráfico de Barras</h3>
              <ExportButtons 
                chartRef={barChartRef} 
                encuestaData={encuestaData} 
                chartType="barras" 
              />
            </div>
            <div ref={barChartRef}>
              <BarChart encuestaData={encuestaData} />
            </div>
          </div>

          {/* Gráfico de Pastel */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Gráfico de Pastel</h3>
              <ExportButtons 
                chartRef={pieChartRef} 
                encuestaData={encuestaData} 
                chartType="pastel" 
              />
            </div>
            <div ref={pieChartRef}>
              <PieChart encuestaData={encuestaData} />
            </div>
          </div>
        </div>

        {/* Gráfico Lineal (ocupa todo el ancho) */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Gráfico Lineal</h3>
            <ExportButtons 
              chartRef={lineChartRef} 
              encuestaData={encuestaData} 
              chartType="lineal" 
            />
          </div>
          <div ref={lineChartRef}>
            <LineChart encuestaData={encuestaData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartView;