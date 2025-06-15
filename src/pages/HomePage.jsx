// src/pages/HomePage.jsx
import React, { useState } from 'react';
// Importa todos los componentes que usaste en el "home" de App.jsx
import Button from '../components/Button';
import InputField from '../components/InputField';
import Card from '../components/Card';
import Checkbox from '../components/Checkbox';
import RadioInput from '../components/RadioInput';
import TextAreaField from '../components/TextAreaField';
import PaginationControls from '../components/PaginationControls';
import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext.jsx';

function HomePage() {
  // Mantén todos los estados y funciones lógicas que pertenecen al home aquí
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [feedbackOption, setFeedbackOption] = useState('excelente');
  const [longAnswer, setLongAnswer] = useState('');
  const { hasRole } = useAuth();
  const [currentSurveyPage, setCurrentSurveyPage] = useState(1);
  const totalSurveyPages = 3;

  const [alert, setAlert] = useState({ message: '', type: 'info' });

  const handleNextPage = () => {
    // ... lógica existente ...
    if (currentSurveyPage < totalSurveyPages) {
      setCurrentSurveyPage(currentSurveyPage + 1);
      setAlert({ message: '', type: 'info' });
    } else {
      setAlert({ message: '¡Has llegado a la última página de la encuesta!', type: 'info' });
    }
  };

  const handlePreviousPage = () => {
    // ... lógica existente ...
    if (currentSurveyPage > 1) {
      setCurrentSurveyPage(currentSurveyPage - 1);
      setAlert({ message: '', type: 'info' });
    } else {
      setAlert({ message: 'Ya estás en la primera página.', type: 'warning' });
    }
  };

  const handleSubmitSurvey = () => {
    // ... lógica existente ...
    setAlert({ message: 'Enviando encuesta...', type: 'info' });
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        setAlert({ message: 'Encuesta enviada con éxito. ¡Gracias!', type: 'success' });
      } else {
        setAlert({ message: 'Error al enviar la encuesta. Por favor, inténtalo de nuevo.', type: 'error' });
      }
    }, 1500);
  };

  const surveys = [
    // ... tus datos de encuestas ...
    {
      id: 1,
      title: 'Encuesta de Satisfacción del Cliente (Q2 2025)',
      description: 'Ayúdanos a mejorar nuestros servicios compartiendo tu experiencia.',
      status: 'Activa',
      questionsCount: 15,
      createdAt: '2025-05-15',
    },
    {
      id: 2,
      title: 'Investigación de Mercado para Nuevo Producto X',
      description: 'Tus opiniones son cruciales para el desarrollo de nuestro próximo gran producto.',
      status: 'Cerrada',
      questionsCount: 10,
      createdAt: '2025-04-01',
    },
    {
      id: 3,
      title: 'Sugerencias para Mejoras en el Campus',
      description: '¿Qué aspectos de la universidad crees que podrían mejorar? ¡Queremos escucharte!',
      status: 'Activa',
      questionsCount: 8,
      createdAt: '2025-05-20',
    },
  ];

  return (
    <> {/* Fragmento para envolver el contenido sin añadir un div extra */}
      {/* Mensaje de alerta (si existe) */}
      {alert.message && (
        <AlertMessage message={alert.message} type={alert.type} className="mb-8 w-full max-w-md" />
      )}

      {/* Contenido principal de bienvenida */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6">
        Bienvenido a UESQuest proyecto de BAD115
      </h1>
      <p className="text-base sm:text-lg text-gray-700 text-center max-w-2xl mx-auto mb-8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias cum, eius, qui dignissimos consequatur repudiandae possimus voluptatum quia impedit asperiores odio dolorum dolorem reprehenderit recusandae maxime alias. Nobis, quae corrupti.
      </p>

      {/* Sección de inputs y textarea de ejemplo */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ejemplo de Campos de Entrada</h2>
        <InputField label="Título de la Encuesta" name="surveyTitle" placeholder="Ej: Encuesta de Satisfacción" />
        <InputField label="Tu Correo Electrónico" name="userEmail" type="email" placeholder="ejemplo@correo.com" />
        <TextAreaField
          label="Tu Respuesta Abierta"
          name="openAnswer"
          placeholder="Escribe tus comentarios aquí..."
          rows={6}
          value={longAnswer}
          onChange={(e) => setLongAnswer(e.target.value)}
        />
      </div>

      {/* Sección para Checkboxes y Radio Buttons */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ejemplos de Selección</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Checkboxes</h3>
          <Checkbox
            id="terms"
            name="terms"
            label="Acepto los términos y condiciones"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <Checkbox
            id="newsletter"
            name="newsletter"
            label="Suscribirme al boletín de noticias"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Radio Buttons (Calidad del Servicio)</h3>
          <RadioInput
            id="feedback-excellent"
            name="feedback"
            label="Excelente"
            value="excelente"
            checked={feedbackOption === 'excelente'}
            onChange={(e) => setFeedbackOption(e.target.value)}
          />
          <RadioInput
            id="feedback-good"
            name="feedback"
            label="Bueno"
            value="good"
            checked={feedbackOption === 'good'}
            onChange={(e) => setFeedbackOption(e.target.value)}
          />
          <RadioInput
            id="feedback-average"
            name="feedback"
            label="Regular"
            value="average"
            checked={feedbackOption === 'average'}
            onChange={(e) => setFeedbackOption(e.target.value)}
          />
          <RadioInput
            id="feedback-poor"
            name="feedback"
            label="Malo"
            value="poor"
            checked={feedbackOption === 'poor'}
            onChange={(e) => setFeedbackOption(e.target.value)}
          />
        </div>
      </div>

      {/* Sección de simulación de encuesta por pasos */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Simulación de Encuesta (Página {currentSurveyPage} de {totalSurveyPages})
        </h2>
        {currentSurveyPage === 1 && (
          <div className="text-gray-700">
            <h3 className="text-xl font-semibold mb-4">Página 1: Información Personal</h3>
            <InputField label="Tu Nombre" name="userName" placeholder="Nombre completo" className="mb-4" />
            <InputField label="Edad" name="userAge" type="number" placeholder="Tu edad" />
          </div>
        )}
        {currentSurveyPage === 2 && (
          <div className="text-gray-700">
            <h3 className="text-xl font-semibold mb-4">Página 2: Experiencia con el Servicio</h3>
            <RadioInput
              id="service-excellent"
              name="serviceQuality"
              label="Excelente"
              value="excellent"
              checked={feedbackOption === 'excellent'}
              onChange={(e) => setFeedbackOption(e.target.value)}
            />
            <RadioInput
              id="service-good"
              name="serviceQuality"
              label="Bueno"
              value="good"
              checked={feedbackOption === 'good'}
              onChange={(e) => setFeedbackOption(e.target.value)}
            />
            <RadioInput
              id="service-average"
              name="serviceQuality"
              label="Regular"
              value="average"
              checked={feedbackOption === 'average'}
              onChange={(e) => setFeedbackOption(e.target.value)}
            />
            <RadioInput
              id="service-poor"
              name="serviceQuality"
              label="Malo"
              value="poor"
              checked={feedbackOption === 'poor'}
              onChange={(e) => setFeedbackOption(e.target.value)}
            />
            <TextAreaField
              label="Comentarios Adicionales"
              name="additionalComments"
              placeholder="¿Hay algo más que te gustaría añadir?"
              rows={4}
            />
          </div>
        )}
        {currentSurveyPage === 3 && (
          <div className="text-gray-700">
            <h3 className="text-xl font-semibold mb-4">Página 3: Confirmación y Envío</h3>
            <p className="mb-4">¡Gracias por completar nuestra encuesta! Por favor, revisa tus respuestas antes de enviar.</p>
            <Checkbox
              id="email-updates"
              name="emailUpdates"
              label="Recibir actualizaciones por correo electrónico"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            <Button variant="primary" className="mt-6 w-full" onClick={handleSubmitSurvey}>
              Enviar Encuesta
            </Button>
          </div>
        )}
        <PaginationControls
          currentPage={currentSurveyPage}
          totalPages={totalSurveyPages}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
          className="mt-8"
        />
      </div>

      {/* Sección para mostrar encuestas con el componente Card */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
        Encuestas Disponibles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{survey.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{survey.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>Preguntas: {survey.questionsCount}</span>
              <span>Creada: {survey.createdAt}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${survey.status === 'Activa' ? 'text-green-600' : 'text-red-600'}`}>
                {survey.status}
              </span>
              <Button variant="primary" className="ml-auto">
                Ver Encuesta
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Botones de ejemplo */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-12">
        <Button variant="primary" onClick={() => alert('¡Crear Encuesta!')}>
          Crear Nueva Encuesta
        </Button>
        <Button variant="secondary" onClick={() => alert('¡Ver Mis Encuestas!')}>
          Ver Mis Encuestas
        </Button>
      </div>
    </>
  );
}

export default HomePage;