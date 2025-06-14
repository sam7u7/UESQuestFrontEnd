import React from 'react';

function QuienesSomosPage() {
  return (
    <div className="w-full px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ¿Quiénes Somos?
        </h1>
        <p className="text-lg text-gray-700">
          En <strong>UESQuest</strong> nos especializamos en la creación, gestión y análisis de encuestas.
          Nuestro objetivo es brindar una plataforma versátil para obtener información precisa mediante encuestas
          académicas, evaluaciones, formularios o estudios de opinión, acompañadas de reportes gráficos detallados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 w-full max-w-6xl mx-auto">
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <img
            src="/img/encuesta.jpg"
            alt="Crear encuestas"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Crea tus propias encuestas
          </h3>
          <p className="text-center text-gray-600">
            UESQuest permite diseñar encuestas de forma personalizada para cualquier objetivo: académico, investigativo o institucional.
          </p>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <img
            src="/img/usuarios.jpg"
            alt="Gestión de usuarios"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Gestión de usuarios y respuestas
          </h3>
          <p className="text-center text-gray-600">
            Controla quién responde, visualiza resultados por usuario o grupo, y asegura integridad y privacidad en cada encuesta.
          </p>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <img
            src="/img/graficos.jpg"
            alt="Gráficos de resultados"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Resultados con gráficos
          </h3>
          <p className="text-center text-gray-600">
            Obtén gráficos intuitivos y exportables de los resultados. Útiles para informes, presentaciones y análisis detallado.
          </p>
        </div>

        {/* Tarjeta 4 */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <img
            src="/img/versatil.jpg"
            alt="Versatilidad"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Versatilidad en usos
          </h3>
          <p className="text-center text-gray-600">
            UESQuest puede ser utilizado para exámenes, formularios de admisión, encuestas de clima laboral, sugerencias estudiantiles y mucho más.
          </p>
        </div>

                {/* Tarjeta 5 */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <img
            src="/img/tiempo3.jpg"
            alt="Sistema activo 24/7"
            className="w-24 h-24 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Sistema activo 24/7
        </h3>
        <p className="text-center text-gray-600">
            UESQuest está disponible en todo momento, las 24 horas del día, los 7 días de la semana, para que puedas crear, responder y analizar encuestas cuando lo necesites.
        </p>
        </div>
      </div>
    </div>
  );
}

export default QuienesSomosPage;
