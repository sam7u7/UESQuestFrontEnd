import React, { useEffect, useState } from 'react';
import LineChart from "../components/LineChart";
import { useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';



const LineChartView = () => {
  const { id } = useParams(); //id de la encuesta url
  const [encuestaData, setEncuestaData] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(()=>{
    if(id){
      const fetchSurveyData = async()=>{
        setLoading(true);
        setError(null);
        try {
          const preguntasResponse = await axiosClient.get(`/api/Encuestas/datos/${id}`);
          const datos = preguntasResponse.data;
          //console.log(datos);
          setEncuestaData(datos);
          
        }catch(error){
          console.error("ERROR: Error al cargar los datos de la encuesta:", error);
          setError("No se pudieron cargar los datos de la encuesta. Inténtalo de nuevo más tarde.");
        }finally{
          setLoading(false);
        }
      }
      fetchSurveyData();
    }

  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!encuestaData) return <div>No se encontraron datos.</div>;
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Título de la encuesta */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {encuestaData.titulo}
            </h1>
    
            {/* Objetivo de la encuesta */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6 border-b pb-4 border-gray-200">
              {encuestaData.objetivo}
            </h2>
    
            {/* Indicaciones para el usuario */}
            <h3 className="text-lg md:text-xl font-normal text-gray-600 mb-8 italic">
              {encuestaData.indicacion}
            </h3>
    
            {/* Componente BarChart */}
            <LineChart encuestaData={encuestaData} />
          </div>
          {/* Botones de exportación */}
        </div>
  );
};

export default LineChartView;