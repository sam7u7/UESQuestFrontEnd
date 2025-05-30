// src/pages/CrearEncuesta.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearEncuesta = () => {
  const navigate = useNavigate();
  const [surveyTitle, setSurveyTitle] = useState('Mi Encuesta');
  const [surveyObjective, setSurveyObjective] = useState('');
  const [surveyInstructions, setSurveyInstructions] = useState('');
  const handleGoToQuestions = () => {
    // Guardar los datos básicos antes de ir a las preguntas
    const surveyData = {
      title: surveyTitle,
      objective: surveyObjective,
      instructions: surveyInstructions
    };
    navigate('/crear-encuesta/preguntas', { state: surveyData });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Crear Nueva Encuesta</h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Título de la encuesta:</label>
          <input
            type="text"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            className="w-full text-2xl font-bold border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
            placeholder="Escribe el título aquí"
          />
        </div>
        
        {/* Objetivo de la encuesta */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo de la encuesta:</label>
          <textarea
            value={surveyObjective}
            onChange={(e) => setSurveyObjective(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe el objetivo de esta encuesta"
            rows="3"
          />
        </div>
        
        {/* Indicaciones de la encuesta */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones para el encuestado:</label>
          <textarea
            value={surveyInstructions}
            onChange={(e) => setSurveyInstructions(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe aquí las indicaciones que deben seguir los encuestados"
            rows="3"
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-10">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
            Guardar borrador
          </button>
          <button 
            onClick={handleGoToQuestions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Añadir Preguntas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearEncuesta;