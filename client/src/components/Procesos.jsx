import React from "react";
import { ListChecks, ClipboardList, Users, FileText, Wrench, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const STEP_COLORS = {
  blue:    { hex: "#38BDF8", glow: "rgba(56,189,248,0.5)",   circleBg: "bg-sky-500",     iconBg: "bg-sky-400/15",     iconText: "text-sky-400",     bullet: "text-sky-400",     tag: "bg-sky-400/10 text-sky-400 border border-sky-400/20",     cardBorderColor: "#38BDF8" },
  violet:  { hex: "#A78BFA", glow: "rgba(167,139,250,0.5)",  circleBg: "bg-violet-500",  iconBg: "bg-violet-400/15",  iconText: "text-violet-400",  bullet: "text-violet-400",  tag: "bg-violet-400/10 text-violet-400 border border-violet-400/20", cardBorderColor: "#A78BFA" },
  amber:   { hex: "#FCD34D", glow: "rgba(252,211,77,0.5)",   circleBg: "bg-amber-500",   iconBg: "bg-amber-300/15",   iconText: "text-amber-300",   bullet: "text-amber-400",   tag: "bg-amber-300/10 text-amber-300 border border-amber-300/20",   cardBorderColor: "#FCD34D" },
  orange:  { hex: "#FB923C", glow: "rgba(251,146,60,0.5)",   circleBg: "bg-orange-500",  iconBg: "bg-orange-400/15",  iconText: "text-orange-400",  bullet: "text-orange-400",  tag: "bg-orange-400/10 text-orange-400 border border-orange-400/20", cardBorderColor: "#FB923C" },
  emerald: { hex: "#34D399", glow: "rgba(52,211,153,0.5)",   circleBg: "bg-emerald-500", iconBg: "bg-emerald-400/15", iconText: "text-emerald-400", bullet: "text-emerald-400", tag: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20", cardBorderColor: "#34D399" },
};

const pasos = [
  { id: "01", color: "blue",    titulo: "Evaluación Inicial",   descripcion: "Análisis del consumo energético actual de la comunidad y viabilidad técnica del sitio",  puntos: ["Medición de consumo promedio", "Evaluación de espacio disponible", "Análisis de recursos solares/eólicos"], Icono: ClipboardList, duracion: "2–4 semanas" },
  { id: "02", color: "violet",  titulo: "Socialización",        descripcion: "Presentación del proyecto a la comunidad y construcción de consenso",                     puntos: ["Asambleas informativas", "Resolución de dudas", "Votación y aprobación"],                           Icono: Users,         duracion: "3–6 semanas" },
  { id: "03", color: "amber",   titulo: "Trámites y Permisos",  descripcion: "Gestión de documentación legal y normativa requerida",                                    puntos: ["Solicitud ante operador de red", "Permisos municipales", "Registro ante autoridades"],             Icono: FileText,      duracion: "4–8 semanas" },
  { id: "04", color: "orange",  titulo: "Instalación",          descripcion: "Implementación física del sistema por personal certificado",                               puntos: ["Montaje de equipos", "Conexión eléctrica", "Pruebas de funcionamiento"],                         Icono: Wrench,        duracion: "2–4 semanas" },
  { id: "05", color: "emerald", titulo: "Puesta en Marcha",     descripcion: "Activación del sistema y monitoreo inicial",                                               puntos: ["Inspección final", "Capacitación a usuarios", "Inicio de generación"],                          Icono: CheckCircle2,  duracion: "1 semana"    },
];

function Procesos() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(148,163,184,1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute -top-16 left-1/3 w-72 h-72 bg-sky-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20 mb-4">
            <ListChecks className="h-3 w-3" />
            Guía paso a paso
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Proceso de{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-emerald-400">
              Implementación
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Conoce las etapas para implementar energía renovable en tu comunidad,
            desde la evaluación inicial hasta la puesta en marcha
          </p>
        </div>
      </div>

      {/* Progress steps overview */}
      <div className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between overflow-x-auto gap-1">
            {pasos.map((paso, idx) => {
              const c = STEP_COLORS[paso.color];
              return (
                <React.Fragment key={paso.id}>
                  <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
                    <div
                      className={`w-9 h-9 rounded-full ${c.circleBg} text-white text-xs font-bold flex items-center justify-center shadow-md`}
                      style={{ boxShadow: `0 0 12px ${c.glow}` }}
                    >
                      {paso.id}
                    </div>
                    <span className="text-[10px] text-slate-500 text-center leading-tight hidden sm:block max-w-[64px]">
                      {paso.titulo.split(" ")[0]}
                    </span>
                  </div>
                  {idx < pasos.length - 1 && (
                    <div className="flex-1 h-px bg-slate-700 min-w-[16px]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-7">
          <span className="inline-block text-xs font-semibold bg-sky-400/10 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full">
            {pasos.length} etapas
          </span>
          <h2 className="text-xl font-bold text-white mt-2">Etapas del proceso completo</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector */}
          <div
            className="absolute left-[19px] top-8 bottom-8 w-0.5"
            style={{ background: "linear-gradient(to bottom, #38BDF8, #A78BFA, #FCD34D, #FB923C, #34D399)" }}
          />

          <div className="space-y-5">
            {pasos.map((paso) => {
              const { Icono } = paso;
              const c = STEP_COLORS[paso.color];
              return (
                <div key={paso.id} className="relative flex items-start gap-5">
                  {/* Step circle */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full ${c.circleBg} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}
                    style={{ boxShadow: `0 0 16px ${c.glow}` }}
                  >
                    {paso.id}
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 bg-slate-900 rounded-2xl border border-slate-700/50 hover:border-slate-600/80 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 overflow-hidden border-l-4"
                    style={{ borderLeftColor: c.hex }}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`${c.iconBg} p-2 rounded-lg flex-shrink-0`}>
                            <Icono className={`w-4 h-4 ${c.iconText}`} />
                          </div>
                          <h3 className="font-bold text-white text-base">{paso.titulo}</h3>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${c.tag}`}>
                          {paso.duracion}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{paso.descripcion}</p>

                      {/* Bullets */}
                      <ul className="space-y-1.5">
                        {paso.puntos.map((punto, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${c.bullet}`} />
                            {punto}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time estimate */}
        <div className="mt-8 bg-slate-900 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="bg-sky-400/15 p-2.5 rounded-xl flex-shrink-0">
              <Clock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm mb-1">Tiempo estimado del proceso completo</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                El proceso completo puede tomar entre{" "}
                <span className="font-bold text-sky-400">3 a 6 meses</span> dependiendo del tamaño del proyecto,
                la complejidad de los trámites y la disponibilidad de recursos financieros y técnicos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Procesos;
