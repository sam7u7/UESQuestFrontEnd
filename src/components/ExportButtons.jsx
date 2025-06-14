import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver/dist/FileSaver';
import { Document, Packer, Paragraph, TextRun } from "docx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  FileX,
  FileText,
  Image as ImageIcon,
  File as FileIcon
} from 'lucide-react';

export default function ExportButtons({ chartRef, encuestaData, chartType }) {
  // Datos para Excel/Word (basados en encuestaData)
  const excelData = encuestaData.preguntas.map((pregunta) => ({
    Pregunta: pregunta.pregunta,
    "Respuestas correctas": pregunta.tipo_respuesta.filter((r) => r.correcta).length,
    "Respuestas totales": pregunta.tipo_respuesta.length,
  }));

  // --- Exportar a Excel (.xlsx) ---
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Encuesta");
    XLSX.writeFile(wb, `encuesta_${chartType}.xlsx`);
  };

  // --- Exportar a PDF (.pdf) ---
  const exportToPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
    pdf.save(`encuesta_${chartType}.pdf`);
  };

  // --- Exportar a Imagen (PNG) ---
  const exportToImage = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = `encuesta_${chartType}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // --- Exportar a Word (.docx) ---
  const exportToWord = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Datos de la Encuesta (${chartType})`,
                  bold: true,
                }),
              ],
            }),
            ...excelData.map(
              (item) =>
                new Paragraph({
                  children: [
                    new TextRun(`Pregunta: ${item.Pregunta}`),
                    new TextRun(` | Correctas: ${item["Respuestas correctas"]}`),
                    new TextRun(` | Totales: ${item["Respuestas totales"]}`),
                  ],
                })
            ),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `encuesta_${chartType}.docx`);
    });
  };

  return (
    /*
    <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
      <button onClick={exportToExcel}>Exportar a Excel</button>
      <button onClick={exportToPDF}>Exportar a PDF</button>
      <button onClick={exportToImage}>Exportar a Imagen</button>
      <button onClick={exportToWord}>Exportar a Word</button>
    </div>
    */
    <div className="my-5 flex gap-4">
  <button
    onClick={exportToExcel}
    title="Exportar a Excel"
    className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
  >
    <FileX className="w-6 h-6" />
  </button>
  <button
    onClick={exportToPDF}
    title="Exportar a PDF"
    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
  >
    <FileText className="w-6 h-6" />
  </button>
  <button
    onClick={exportToImage}
    title="Exportar a Imagen"
    className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
  >
    <ImageIcon className="w-6 h-6" />
  </button>
  <button
    onClick={exportToWord}
    title="Exportar a Word"
    className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition"
  >
    <FileIcon className="w-6 h-6" />
  </button>
    </div>
  );
}