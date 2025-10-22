import React from 'react'
import { ClipboardList, Users, FileText, Wrench, CheckCircle2, Clock } from "lucide-react";



const pasos = [
  {
    id: "01",
    titulo: "Evaluación Inicial",
    descripcion: "Análisis del consumo energético actual de la comunidad y viabilidad técnica del sitio",
    puntos: [
      "Medición de consumo promedio",
      "Evaluación de espacio disponible",
      "Análisis de recursos solares/eólicos",
    ],
    icono: <ClipboardList className="w-6 h-6 text-white" />,
  },
  {
    id: "02",
    titulo: "Socialización",
    descripcion: "Presentación del proyecto a la comunidad y construcción de consenso",
    puntos: [
      "Asambleas informativas",
      "Resolución de dudas",
      "Votación y aprobación",
    ],
    icono: <Users className="w-6 h-6 text-white" />,
  },
  {
    id: "03",
    titulo: "Trámites y Permisos",
    descripcion: "Gestión de documentación legal y normativa requerida",
    puntos: [
      "Solicitud ante operador de red",
      "Permisos municipales",
      "Registro ante autoridades",
    ],
    icono: <FileText className="w-6 h-6 text-white" />,
  },
  {
    id: "04",
    titulo: "Instalación",
    descripcion: "Implementación física del sistema por personal certificado",
    puntos: [
      "Montaje de equipos",
      "Conexión eléctrica",
      "Pruebas de funcionamiento",
    ],
    icono: <Wrench className="w-6 h-6 text-white" />,
  },
  {
    id: "05",
    titulo: "Puesta en Marcha",
    descripcion: "Activación del sistema y monitoreo inicial",
    puntos: [
      "Inspección final",
      "Capacitación a usuarios",
      "Inicio de generación",
    ],
    icono: <CheckCircle2 className="w-6 h-6 text-white" />,
  },
];

function Procesos  ()  {
  return (
    <section id="proceso" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto text-center px-6">
        <span className="text-blue-600 bg-blue-50 px-4 py-1 rounded-full text-sm font-medium">Paso a Paso</span>
        <h2 className="text-4xl font-bold text-gray-900 mt-4">Proceso de Implementación</h2>
        <p className="text-gray-600 mt-2">
          Conoce de forma clara y detallada las etapas para implementar un sistema
          de energías renovables en tu comunidad
        </p>

        <div className="mt-16 relative border-l-2 border-blue-100 space-y-10">
          {pasos.map((paso) => (
            <div key={paso.id} className="relative bg-white rounded-2xl shadow-sm border p-6 text-left">
              <div className="absolute -left-5 top-6 bg-blue-600 rounded-xl p-3">
                {paso.icono}
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-2 py-0.5">{paso.id}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-10">{paso.titulo}</h3>
              <p className="text-gray-600 ml-10 mt-1">{paso.descripcion}</p>
              <ul className="mt-3 ml-10 space-y-2 text-gray-700">
                {paso.puntos.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-blue-500">→</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Bloque final */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 ml-6 text-left">
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Tiempo estimado del proceso
            </p>
            <p className="text-gray-600 mt-1">
              El proceso completo puede tomar entre <strong>3 a 6 meses</strong> dependiendo del tamaño del proyecto,
              la complejidad de los trámites y la disponibilidad de recursos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Procesos;