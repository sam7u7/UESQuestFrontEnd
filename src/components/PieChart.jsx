import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ encuestaData }) {
  // Procesar datos para contar respuestas correctas e incorrectas
  let correctas = 0;
  let incorrectas = 0;

  encuestaData.encuesta_realizada.forEach((realizada) => {
    realizada.pregunta_realiza_pregunta.forEach((respuesta) => {
      const pregunta = encuestaData.preguntas.find(p => p.id === respuesta.id_pregunta);
      if (pregunta) {
        const esCorrecta = pregunta.tipo_respuesta.some(
          r => r.id === respuesta.id_respuesta && r.correcta
        );
        esCorrecta ? correctas++ : incorrectas++;
      }
    });
  });

  const data = {
    labels: ["Correctas", "Incorrectas"],
    datasets: [
      {
        data: [correctas, incorrectas],
        backgroundColor: ["#4BC0C0", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF8A80"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Porcentaje de respuestas correctas vs. incorrectas",
      },
    },
  };

  return <Pie data={data} options={options} />;
}