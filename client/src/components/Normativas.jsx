import { useState } from "react";
import {
  Scale,
  FileText,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

const categorias = [
  {
    Icono: Scale,
    iconBoxBg: "bg-rose-50",
    iconColor: "text-rose-500",
    titulo: "Leyes y Decretos",
    items: [
      {
        title: "Ley 1715 de 2014",
        description:
          "Regula la integración de energías renovables no convencionales al Sistema Energético Nacional",
        note: "Marco legal principal",
      },
      {
        title: "Ley 2099 de 2021",
        description:
          "Dicta disposiciones para la transición energética y modernización del mercado",
        note: "Actualización normativa",
      },
    ],
  },
  {
    Icono: FileText,
    iconBoxBg: "bg-blue-50",
    iconColor: "text-blue-500",
    titulo: "Resoluciones CREG",
    items: [
      {
        title: "Resolución CREG 030 de 2018",
        description:
          "Regula la autogeneración a pequeña escala y generación distribuida",
        note: "Permite venta de excedentes a la red",
      },
      {
        title: "Resolución CREG 174 de 2021",
        description: "Define metodología para cálculo de costos de conexión",
        note: "Clarifica costos de conexión al sistema",
      },
    ],
  },
  {
    Icono: BookOpen,
    iconBoxBg: "bg-green-50",
    iconColor: "text-green-600",
    titulo: "Normas Técnicas",
    items: [
      {
        title: "NTC 2050 (RETIE)",
        description:
          "Reglamento Técnico de Instalaciones Eléctricas — estándares de seguridad",
        note: "Obligatorio para instalaciones",
      },
      {
        title: "NTC 5746",
        description:
          "Sistemas fotovoltaicos conectados a la red eléctrica — especificaciones técnicas",
        note: "Aplica a sistemas solares",
      },
    ],
  },
  {
    Icono: Award,
    iconBoxBg: "bg-amber-50",
    iconColor: "text-amber-500",
    titulo: "Incentivos Tributarios",
    items: [
      {
        title: "Deducción de Renta",
        description:
          "Hasta el 50% del valor de la inversión deducible del impuesto de renta por 5 años",
        note: "Beneficio por 5 años",
      },
      {
        title: "Exclusión de IVA",
        description:
          "Equipos para generación renovable exentos de IVA — reducción directa de costos",
        note: "Aplica a equipos importados",
      },
      {
        title: "Exención Arancelaria",
        description:
          "No pago de aranceles para importación de equipos no producidos en Colombia",
        note: "Reducción costos de importación",
      },
    ],
  },
];

function Accordion({ Icono, iconBoxBg, iconColor, titulo, items }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`${iconBoxBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <Icono className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className="font-semibold text-gray-800 text-base text-left">
            {titulo}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 text-sm">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                {item.note}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Normativas() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Normativas y <span className="text-emerald-400">Regulaciones</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Marco legal simplificado: leyes, resoluciones CREG, normas técnicas
            e incentivos para energías renovables en Colombia
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Accordions */}
        {categorias.map((cat, idx) => (
          <Accordion
            key={idx}
            Icono={cat.Icono}
            iconBoxBg={cat.iconBoxBg}
            iconColor={cat.iconColor}
            titulo={cat.titulo}
            items={cat.items}
          />
        ))}

        {/* Sources box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-5 h-5 text-green-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-800 text-base">
              Fuentes Oficiales
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="#"
              className="flex items-center gap-2 text-green-700 text-sm hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              Ministerio de Minas y Energía
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-green-700 text-sm hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              UPME
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-green-700 text-sm hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              CREG
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-green-700 text-sm hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              ICONTEC
            </a>
          </div>
        </div>

        {/* Note box */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mt-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            <span className="font-semibold">Nota:</span> Esta información tiene
            fines educativos. Para casos específicos, consulta con asesores
            legales y técnicos especializados.
          </p>
        </div>
      </div>
    </div>
  );
}
