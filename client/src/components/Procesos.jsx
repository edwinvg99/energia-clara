import React from "react";
import {
  ListChecks,
  ClipboardList,
  Users,
  FileText,
  Wrench,
  CheckCircle2,
  Clock,
} from "lucide-react";

const pasos = [
  {
    id: "01",
    titulo: "Evaluación Inicial",
    descripcion:
      "Análisis del consumo energético actual de la comunidad y viabilidad técnica del sitio",
    puntos: [
      "Medición de consumo promedio",
      "Evaluación de espacio disponible",
      "Análisis de recursos solares/eólicos",
    ],
    Icono: ClipboardList,
    colorBg: "bg-blue-600",
    iconBoxBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "02",
    titulo: "Socialización",
    descripcion:
      "Presentación del proyecto a la comunidad y construcción de consenso",
    puntos: [
      "Asambleas informativas",
      "Resolución de dudas",
      "Votación y aprobación",
    ],
    Icono: Users,
    colorBg: "bg-blue-600",
    iconBoxBg: "bg-blue-50",
    iconColor: "text-blue-600",
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
    Icono: FileText,
    colorBg: "bg-blue-600",
    iconBoxBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "04",
    titulo: "Instalación",
    descripcion:
      "Implementación física del sistema por personal certificado",
    puntos: [
      "Montaje de equipos",
      "Conexión eléctrica",
      "Pruebas de funcionamiento",
    ],
    Icono: Wrench,
    colorBg: "bg-blue-600",
    iconBoxBg: "bg-blue-50",
    iconColor: "text-blue-600",
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
    Icono: CheckCircle2,
    colorBg: "bg-emerald-600",
    iconBoxBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

function Procesos() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
         
      
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Proceso de             <span className="text-emerald-400">Implementación</span>
 
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Conoce las etapas para implementar energía renovable en tu comunidad,
            desde la evaluación inicial hasta la puesta en marcha
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {pasos.map((paso) => {
              const { Icono } = paso;
              return (
                <div key={paso.id} className="relative flex items-start gap-6">
                  {/* Step circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                      {paso.id}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                    {/* Header row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${paso.iconBoxBg} p-2 rounded-lg flex-shrink-0`}>
                        <Icono className={`w-5 h-5 ${paso.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {paso.titulo}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">
                      {paso.descripcion}
                    </p>

                    {/* Bullet points */}
                    <ul className="space-y-1.5">
                      {paso.puntos.map((punto, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="text-blue-500 font-semibold">→</span>
                          {punto}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time estimate card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-blue-900 text-sm mb-1">
              Tiempo estimado del proceso
            </p>
            <p className="text-blue-800 text-sm leading-relaxed">
              El proceso completo puede tomar entre{" "}
              <strong>3 a 6 meses</strong> dependiendo del tamaño del proyecto,
              la complejidad de los trámites y la disponibilidad de recursos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Procesos;
