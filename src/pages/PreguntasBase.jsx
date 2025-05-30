// src/pages/PreguntasBase.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PreguntasBase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  
  // Datos básicos de la encuesta
  const surveyData = location.state || {
    title: 'Mi Encuesta',
    objective: '',
    instructions: ''
  };

  // Definición de tipos de preguntas
  const questionTypes = [
    {
      id: 'dichotomous',
      name: 'Dicotómica',
      description: 'Solo 2 alternativas (Sí/No, Verdadero/Falso)',
      defaultOptions: ['Sí', 'No'],
      icon: '≡'
    },
    {
      id: 'polytomous',
      name: 'Politómica',
      description: 'Elección única entre varias alternativas excluyentes',
      defaultOptions: ['Opción 1', 'Opción 2', 'Opción 3'],
      icon: '○'
    },
    {
      id: 'multiple',
      name: 'Elección múltiple',
      description: 'Seleccionar una o más opciones',
      defaultOptions: ['Opción 1', 'Opción 2', 'Opción 3'],
      icon: '☑'
    },
    {
      id: 'ranking',
      name: 'Ranking',
      description: 'Jerarquizar opciones por orden de preferencia',
      defaultOptions: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
      icon: '⇅'
    },
    {
      id: 'likert',
      name: 'Escala Likert',
      description: 'Evaluar acuerdo/desacuerdo en escala de 5 puntos',
      defaultOptions: [
        'Totalmente en desacuerdo',
        'En desacuerdo',
        'Ni de acuerdo ni en desacuerdo',
        'De acuerdo',
        'Totalmente de acuerdo'
      ],
      icon: '⇆'
    },
    {
      id: 'numeric',
      name: 'Escala numérica',
      description: 'Evaluar en escala numérica (ej. 1-5, 1-10)',
      defaultOptions: ['1', '2', '3', '4', '5'],
      icon: '123'
    },
    {
      id: 'mixed',
      name: 'Mixta',
      description: 'Opciones cerradas + campo abierto "Otros"',
      defaultOptions: ['Opción 1', 'Opción 2', 'Otros (especificar)'],
      icon: '+T'
    }
  ];

  // Añadir nueva pregunta según tipo seleccionado
  const addNewQuestion = (type) => {
    const typeConfig = questionTypes.find(t => t.id === type);
    
    const newQuestion = {
      id: Date.now(),
      title: `Nueva pregunta ${questions.length + 1}`,
      type: type,
      expanded: true,
      options: [...typeConfig.defaultOptions],
      config: {
        allowMultiple: type === 'multiple',
        includeOtherOption: type === 'mixed',
        isRanking: type === 'ranking',
        isNumericScale: type === 'numeric',
        isLikertScale: type === 'likert'
      }
    };
    
    setQuestions([...questions, newQuestion]);
    setShowQuestionTypes(false);
  };

  // Función para renderizar el input adecuado según tipo de pregunta
  const renderQuestionInput = (question, option, index) => {
    if (question.config.isLikertScale || question.config.isNumericScale) {
      return (
        <div className="flex items-center justify-between w-full">
          <span className="mr-3 text-gray-600">{option}</span>
          {question.config.isLikertScale && (
            <select className="border border-gray-300 rounded px-2 py-1">
              {question.options.map((_, i) => (
                <option key={i} value={i}>{i+1}</option>
              ))}
            </select>
          )}
          {question.config.isNumericScale && (
            <input 
              type="number" 
              min="1" 
              max={question.options.length}
              className="border border-gray-300 rounded px-2 py-1 w-16"
            />
          )}
        </div>
      );
    }

    return (
      <input
        type="text"
        value={option}
        onChange={(e) => updateOption(question.id, index, e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Escribe la opción"
      />
    );
  };

  // Funciones de utilidad
  const toggleQuestion = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, expanded: !q.expanded } : q));
  };

  const updateQuestionTitle = (id, newTitle) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, title: newTitle } : q));
  };

  const addOptionToQuestion = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption = `Opción ${q.options.length + 1}`;
        return { ...q, options: [...q.options, newOption] };
      }
      return q;
    }));
  };

  const updateOption = (questionId, optionIndex, newValue) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = newValue;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSave = () => {
    const fullSurvey = {
      ...surveyData,
      questions: questions
    };
    console.log('Encuesta completa:', fullSurvey);
    navigate('/crear-encuesta');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-blue-600">Encuesta:</span>
          <span className="ml-2 text-2xl">{surveyData.title}</span>
        </h1>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar Preguntas
        </button>
      </div>

      {/* Resumen de la encuesta */}
      <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Objetivo:</h2>
          <p className="text-gray-700">{surveyData.objective || 'Sin objetivo definido'}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Indicaciones:</h2>
          <p className="text-gray-700">{surveyData.instructions || 'Sin indicaciones definidas'}</p>
        </div>
      </div>
      
      {/* Panel de preguntas */}
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 mb-6 bg-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">Preguntas ({questions.length})</h3>
          <button
            onClick={() => setShowQuestionTypes(!showQuestionTypes)}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Añadir Pregunta
          </button>
        </div>

        {/* Selector de tipos de pregunta */}
        {showQuestionTypes && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h4 className="text-md font-semibold mb-3">Selecciona el tipo de pregunta:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => addNewQuestion(type.id)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 text-left transition-colors"
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{type.icon}</span>
                    <div>
                      <div className="font-medium text-blue-700">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Listado de preguntas */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay preguntas añadidas todavía
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Encabezado de la pregunta */}
                <div className="flex justify-between items-center p-4 bg-gray-50">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                      {questionTypes.find(t => t.id === question.type)?.name || 'Pregunta'}
                    </span>
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) => updateQuestionTitle(question.id, e.target.value)}
                      className="ml-2 font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                      placeholder="Escribe la pregunta"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar pregunta"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      {question.expanded ? 'Contraer' : 'Expandir'}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform ${question.expanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Contenido expandido de la pregunta */}
                {question.expanded && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opciones de respuesta:
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center">
                            {/* Icono según tipo de pregunta */}
                            {question.config.allowMultiple ? (
                              <input
                                type="checkbox"
                                className="mr-3"
                                disabled
                              />
                            ) : question.config.isRanking ? (
                              <span className="mr-3 text-gray-500">{index + 1}.</span>
                            ) : (
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                className="mr-3"
                                disabled
                              />
                            )}
                            
                            {renderQuestionInput(question, option, index)}
                            
                            {/* Indicador de campo abierto para preguntas mixtas */}
                            {question.config.includeOtherOption && index === question.options.length - 1 && (
                              <span className="ml-2 text-sm text-gray-500">(Campo abierto)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Pie de pregunta */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => addOptionToQuestion(question.id)}
                        className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                        disabled={question.config.isLikertScale || question.config.isNumericScale}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Añadir opción
                      </button>
                      <span className="text-sm text-gray-500">
                        Tipo: {questionTypes.find(t => t.id === question.type)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PreguntasBase;