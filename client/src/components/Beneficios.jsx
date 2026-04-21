import React from "react";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  Zap,
  Home,
  BarChart2,
  Shield,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    color: "emerald",
    title: "Reducción de Costos",
    description:
      "Ahorra hasta un 40% en tu factura eléctrica con un sistema de paneles solares residencial",
    stat: "40%",
    statLabel: "Ahorro promedio",
  },
  {
    icon: Leaf,
    color: "green",
    title: "Impacto Ambiental",
    description:
      "Reduce la huella de carbono y contribuye a los objetivos climáticos de Colombia",
    stat: "25 ton",
    statLabel: "CO₂ evitado/año",
  },
  {
    icon: Zap,
    color: "amber",
    title: "Independencia Energética",
    description:
      "Genera tu propia energía y reduce la dependencia de la red eléctrica nacional",
    stat: "70%",
    statLabel: "Autosuficiencia",
  },
  {
    icon: Home,
    color: "blue",
    title: "Valorización",
    description:
      "Los inmuebles con sistemas de energía renovable tienen mayor valor en el mercado",
    stat: "+15%",
    statLabel: "Valorización",
  },
  {
    icon: BarChart2,
    color: "purple",
    title: "Retorno de Inversión",
    description:
      "Recupera tu inversión con incentivos gubernamentales y ahorro en factura",
    stat: "5–7 años",
    statLabel: "Período de retorno",
  },
  {
    icon: Shield,
    color: "orange",
    title: "Estabilidad Tarifaria",
    description:
      "Protégete de futuros aumentos en tarifas con generación propia garantizada",
    stat: "20 años",
    statLabel: "Vida útil garantizada",
  },
];

const ICON_COLORS = {
  emerald: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    stat: "text-emerald-600",
  },
  green: {
    iconBg: "bg-green-50",
    iconText: "text-green-600",
    stat: "text-green-600",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-500",
    stat: "text-amber-500",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    stat: "text-blue-600",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconText: "text-purple-500",
    stat: "text-purple-500",
  },
  orange: {
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
    stat: "text-orange-500",
  },
};

function BenefitCard({ icon: Icon, color, title, description, stat, statLabel }) {
  const c = ICON_COLORS[color];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col gap-4">
      {/* Icon */}
      <div
        className={`flex items-center justify-center w-11 h-11 rounded-lg ${c.iconBg}`}
      >
        <Icon className={`w-6 h-6 ${c.iconText}`} />
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Stat */}
      <div className="border-t border-gray-100 pt-4">
        <p className={`text-2xl font-bold mb-0.5 ${c.stat}`}>{stat}</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {statLabel}
        </p>
      </div>
    </div>
  );
}

function Beneficios() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-4">
          {/* Icon */}
         

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Beneficios de las{" "}
            <span className="text-emerald-400">Energías Renovables</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 max-w-2xl text-base sm:text-lg leading-relaxed">
            Descubre el impacto económico, ambiental y social de implementar
            energías renovables en Colombia
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section label */}
        <div className="mb-7">
          <span className="inline-block text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Impacto directo
          </span>
        </div>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {benefits.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        </div>

        {/* Attribution box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Información basada en fuentes oficiales
          </h3>
          <p className="text-sm text-gray-600 mb-5 max-w-3xl">
            Toda la información presentada está respaldada por normativas
            gubernamentales, estudios técnicos y datos verificados de
            instituciones reconocidas en Colombia.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white border border-emerald-200 px-4 py-1.5 rounded-full text-sm text-gray-700 font-medium">
              Ministerio de Energía
            </span>
            <span className="bg-white border border-emerald-200 px-4 py-1.5 rounded-full text-sm text-gray-700 font-medium">
              UPME
            </span>
            <span className="bg-white border border-emerald-200 px-4 py-1.5 rounded-full text-sm text-gray-700 font-medium">
              CREG
            </span>
            <span className="bg-white border border-emerald-200 px-4 py-1.5 rounded-full text-sm text-gray-700 font-medium">
              Normativa Técnica
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beneficios;
