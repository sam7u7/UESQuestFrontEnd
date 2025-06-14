import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ encuestaData }) {
  // Agrupar datos por fecha (ejemplo simplificado)
  const datosPorFecha = {};
  encuestaData.encuesta_realizada.forEach((realizada) => {
    const fecha = new Date(realizada.created_at).toLocaleDateString();
    if (!datosPorFecha[fecha]) datosPorFecha[fecha] = 0;
    
    // Contar respuestas correctas por fecha
    realizada.pregunta_realiza_pregunta.forEach((respuesta) => {
      const pregunta = encuestaData.preguntas.find(p => p.id === respuesta.id_pregunta);
      if (pregunta) {
        const esCorrecta = pregunta.tipo_respuesta.some(
          r => r.id === respuesta.id_respuesta && r.correcta
        );
        if (esCorrecta) datosPorFecha[fecha]++;
      }
    });
  });

  const labels = Object.keys(datosPorFecha);
  const data = {
    labels,
    datasets: [
      {
        label: "Respuestas correctas por día",
        data: Object.values(datosPorFecha),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Rendimiento de usuarios por fecha",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}