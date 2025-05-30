// src/pages/CrearEncuesta.jsx
import React, { useState } from 'react';

const CrearEncuesta = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState('Mi Encuesta');
  const [surveyObjective, setSurveyObjective] = useState('');
  const [surveyInstructions, setSurveyInstructions] = useState('');
  const [questions, setQuestions] = useState([]);

  const startNewSurvey = () => {
    setShowEditor(true);
    setQuestions([{ 
      id: Date.now(), 
      title: 'Pregunta 1', 
      expanded: true,
      options: ['Opción 1', 'Opción 2'] 
    }]);
  };

  const addNewQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      title: `Pregunta ${questions.length + 1}`,
      expanded: false,
      options: ['Opción 1', 'Opción 2']
    };
    setQuestions([...questions, newQuestion]);
  };

  const toggleQuestion = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, expanded: !q.expanded } : q
    ));
  };

  const updateQuestionTitle = (id, newTitle) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, title: newTitle } : q
    ));
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

  // Función para editar opciones de respuesta
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

  // Función para eliminar pregunta
  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Crear Nueva Encuesta</h1>
      
      {!showEditor ? (
        <div className="flex justify-center">
          <button
            onClick={startNewSurvey}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Crear Encuesta
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              <span className="text-blue-600">Encuesta:</span>
              <input
                type="text"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="ml-2 text-2xl font-bold border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                placeholder="Título de la encuesta"
              />
            </h2>
          </div>
          
          {/* Objetivo de la encuesta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo de la encuesta:</label>
            <textarea
              value={surveyObjective}
              onChange={(e) => setSurveyObjective(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe el objetivo de esta encuesta"
              rows="2"
            />
          </div>
          
          {/* Indicaciones de la encuesta */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones para el encuestado:</label>
            <textarea
              value={surveyInstructions}
              onChange={(e) => setSurveyInstructions(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escribe aquí las indicaciones que deben seguir los encuestados"
              rows="2"
            />
          </div>
          
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 mb-6 bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-800">Preguntas</h3>
              <button
                onClick={addNewQuestion}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir Pregunta
              </button>
            </div>
            
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="flex justify-between items-center p-4 bg-gray-50">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                        Pregunta {questions.findIndex(q => q.id === question.id) + 1}
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
                      {/* Botón para eliminar pregunta */}
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
                  
                  {question.expanded && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opciones de respuesta:
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                className="mr-3"
                                disabled
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(question.id, index, e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Escribe la opción"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addOptionToQuestion(question.id)}
                        className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Añadir opción
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
              Guardar borrador
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Publicar encuesta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearEncuesta;