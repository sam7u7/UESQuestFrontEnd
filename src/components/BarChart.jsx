import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registra los componentes (si no lo hiciste en un archivo aparte)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export default function BarChart({encuestaData}) {
  // Procesar los datos de la encuesta
  const datosProcesados = procesarDatosEncuesta(encuestaData);

  // Preparar datos para Chart.js
  const labels = datosProcesados.map((item) => item.pregunta);
  const respuestas = datosProcesados[0].respuestas.map((r) => r.texto);

  // Colores para respuestas correctas/incorrectas
  const backgroundColors = datosProcesados[0].respuestas.map((r) =>
    r.correcta ? "rgba(75, 192, 192, 0.6)" : "rgba(196, 49, 81, 0.61)"
  );

  // Datasets para cada respuesta
  const datasets = respuestas.map((respuesta, i) => {
    return {
      label: respuesta,
      data: datosProcesados.map((pregunta) => {
        const total = pregunta.respuestas.reduce((sum, r) => sum + r.count, 0);
        const resp = pregunta.respuestas.find((r) => r.texto === respuesta);
        return total > 0 ? (resp.count / total) * 100 : 0;
      }),
      backgroundColor: backgroundColors[i],
    };
  });

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const respuesta = datosProcesados[context.dataIndex].respuestas.find(
              (r) => r.texto === context.dataset.label
            );
            return `Correcta: ${respuesta.correcta ? "Sí" : "No"}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Barras apiladas
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

const procesarDatosEncuesta = (encuestaData) =>{
  const { preguntas, encuesta_realizada } = encuestaData;

  // Mapear cada pregunta
  return preguntas.map((pregunta) => {
    const respuestas = pregunta.tipo_respuesta;
    const respuestasCount = {};

    // Inicializar contadores para cada respuesta
    respuestas.forEach((respuesta) => {
      respuestasCount[respuesta.id] = {
        texto: respuesta.respuesta,
        correcta: respuesta.correcta,
        count: 0,
      };
    });

    // Contar las respuestas seleccionadas en encuesta_realizada
    encuesta_realizada.forEach((realizada) => {
      realizada.pregunta_realiza_pregunta.forEach((respuestaRealizada) => {
        if (respuestaRealizada.id_pregunta === pregunta.id) {
          const respuestaId = respuestaRealizada.id_respuesta;
          if (respuestasCount[respuestaId]) {
            respuestasCount[respuestaId].count += 1;
          }
        }
      });
    });

    return {
      pregunta: pregunta.pregunta,
      respuestas: Object.values(respuestasCount),
    };
  });
};