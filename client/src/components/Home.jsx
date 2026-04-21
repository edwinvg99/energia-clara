import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  TrendingUp,
  ListChecks,
  Scale,
  Newspaper,
  FileText,
  Zap,
  Activity,
} from "lucide-react";

const HERO_IMAGE_URL =
  "https://www.thecircularlab.com/web/app/uploads/2024/07/post-tcl-energia-limpia.jpg";

const COLOR_MAP = {
  emerald: {
    bg: "bg-emerald-500",
    textLight: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    shadow: "hover:shadow-emerald-500/20",
  },
  green: {
    bg: "bg-green-500",
    textLight: "text-green-400",
    badge: "bg-green-500/20 text-green-300",
    shadow: "hover:shadow-green-500/20",
  },
  blue: {
    bg: "bg-blue-500",
    textLight: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
    shadow: "hover:shadow-blue-500/20",
  },
  purple: {
    bg: "bg-purple-500",
    textLight: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-300",
    shadow: "hover:shadow-purple-500/20",
  },
  orange: {
    bg: "bg-orange-500",
    textLight: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
    shadow: "hover:shadow-orange-500/20",
  },
  cyan: {
    bg: "bg-cyan-500",
    textLight: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300",
    shadow: "hover:shadow-cyan-500/20",
  },
  rose: {
    bg: "bg-rose-500",
    textLight: "text-rose-400",
    badge: "bg-rose-500/20 text-rose-300",
    shadow: "hover:shadow-rose-500/20",
  },
  amber: {
    bg: "bg-amber-500",
    textLight: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
    shadow: "hover:shadow-amber-500/20",
  },
  teal: {
    bg: "bg-teal-500",
    textLight: "text-teal-400",
    badge: "bg-teal-500/20 text-teal-300",
    shadow: "hover:shadow-teal-500/20",
  },
};

const sections = [
  {
    to: "/educativo",
    icon: BookOpen,
    color: "emerald",
    badge: "Módulos Educativos",
    title: "Módulos Educativos",
    description:
      "Aprende con módulos interactivos y certificados sobre energías renovables",
  },
  {
    to: "/beneficios",
    icon: TrendingUp,
    color: "green",
    badge: "Beneficios",
    title: "Beneficios",
    description:
      "Ahorro económico, impacto ambiental e independencia energética",
  },
  {
    to: "/procesos",
    icon: ListChecks,
    color: "blue",
    badge: "Proceso de Implementación",
    title: "Proceso de Implementación",
    description:
      "Guía paso a paso para instalar energía renovable en tu comunidad",
  },
  {
    to: "/actores",
    icon: Users,
    color: "purple",
    badge: "Actores Involucrados",
    title: "Actores Involucrados",
    description:
      "Instituciones, empresas y comunidades del ecosistema renovable",
  },
  {
    to: "/normativas",
    icon: Scale,
    color: "orange",
    badge: "Normativas y Leyes",
    title: "Normativas y Leyes",
    description:
      "Ley 1715, Ley 2099, resoluciones CREG e incentivos tributarios",
  },
  {
    to: "/noticias",
    icon: Newspaper,
    color: "cyan",
    badge: "Noticias del Sector",
    title: "Noticias del Sector",
    description: "Últimas novedades sobre energías renovables en Colombia",
  },
  {
    to: "/documentos-creg",
    icon: FileText,
    color: "rose",
    badge: "Documentos CREG",
    title: "Documentos CREG",
    description:
      "Resoluciones, circulares y autos publicados por la CREG",
  },
  {
    to: "/mercado-energia",
    icon: Zap,
    color: "amber",
    badge: "Mercado de Energía",
    title: "Mercado de Energía",
    description:
      "Mix de generación eléctrica del SIN por tipo de fuente (SIMEM)",
  },
  {
    to: "/indicadores",
    icon: Activity,
    color: "teal",
    badge: "Indicadores XM",
    title: "Indicadores XM",
    description:
      "Demanda, precio de bolsa, volumen útil y emisiones CO₂",
  },
];

const stats = [
  { number: "9", label: "Secciones" },
  { number: "4", label: "Módulos educativos" },
  { number: "3", label: "APIs en tiempo real" },
  { number: "8", label: "Indicadores del SIN" },
];

function SectionCard({ to, icon: Icon, color, badge, title, description }) {
  const c = COLOR_MAP[color];
  return (
    <Link
      to={to}
      className={`group flex flex-col bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-slate-600/80 hover:shadow-lg ${c.shadow} transition-all duration-300 overflow-hidden`}
    >
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Icon box + badge row */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${c.bg}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.badge}`}>
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed flex-1">
          {description}
        </p>

        {/* Footer link */}
        <div className={`flex items-center gap-1 text-sm font-semibold mt-1 ${c.textLight}`}>
          Ver sección
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── HERO ── */}
      <section className="relative min-h-[520px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt="Turbinas de energía renovable"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl space-y-6">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
              Plataforma de información energética
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Información clara sobre{" "}
              <span className="text-emerald-400">energías renovables</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Accede a datos verificados, módulos educativos y normativas
              actualizadas sobre la transición energética en Colombia.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/educativo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-colors duration-200"
              >
                <BookOpen className="w-4 h-4" />
                Módulos educativos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/indicadores"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-colors duration-200"
              >
                <Activity className="w-4 h-4" />
                Ver indicadores en vivo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-slate-800/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{s.number}</p>
                <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACCESS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Section heading */}
        <div className="mb-8">
          <span className="inline-block text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full mb-3 ring-1 ring-emerald-500/30">
            Navegación
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Acceso rápido
          </h2>
          <p className="text-slate-400 mt-1.5 text-sm sm:text-base">
            Explora todas las secciones de la plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s) => (
            <SectionCard key={s.to} {...s} />
          ))}
        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            ¿Por qué Energía Clara?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Datos verificados
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Fuentes oficiales SIMEM, XM y CREG
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 mb-4">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Contenido educativo
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Módulos con certificados incluidos
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 mb-4">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Para todos
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Desde hogares hasta grandes empresas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
