import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  BookOpen,
  Award,
  ExternalLink,
} from "lucide-react";

// eslint-disable-next-line no-unused-vars
const Accordion = ({ icon: IconComponent, color, title, items }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border rounded-2xl shadow-cyan-950 shadow-2xl mb-6 bg-gray-100">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full p-5 bg-gray-300 hover:bg-gray-50 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6 text-gray-900" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
        </div>
        {open ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="p-5 pt-0 space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-4 transition-all text-center"
            >
              <h3 className="font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {item.description}
              </p>
              <div className="flex items-center justify-center-safe gap-2 mt-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-700 text-sm bg-green-50 px-3 py-1 rounded-full">
                  {item.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FuentesOficiales = () => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-10 text-left">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 rounded-xl bg-green-200 bg-opacity-10">
        <ExternalLink className="text-green-600 w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        Fuentes Oficiales de Información
      </h3>
    </div>
    <p className="text-gray-700 text-sm mb-3">
      Para consultar el texto completo de las normativas y obtener información actualizada, puedes visitar:
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
      <a
        href="#"
        className="flex items-center gap-2 text-green-700 hover:underline"
      >
        <ExternalLink size={14} /> Ministerio de Minas y Energía
      </a>
      <a
        href="#"
        className="flex items-center gap-2 text-green-700 hover:underline"
      >
        <ExternalLink size={14} /> UPME
      </a>
      <a
        href="#"
        className="flex items-center gap-2 text-green-700 hover:underline"
      >
        <ExternalLink size={14} /> CREG
      </a>
      <a
        href="#"
        className="flex items-center gap-2 text-green-700 hover:underline"
      >
        <ExternalLink size={14} /> ICONTEC (Normas Técnicas)
      </a>
    </div>
  </div>
);

const Nota = () => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl mt-6 p-4 text-left">
    <p className="text-gray-700 text-sm">
      <span className="font-semibold">Nota:</span> Esta información tiene fines educativos e informativos. 
      Para casos específicos, se recomienda consultar con asesores legales y técnicos especializados.
    </p>
  </div>
);

export default function Normativas() {
    const leyes = [
    {
      title: "Ley 1715 de 2014",
      description:
        "Regula la integración de energías renovables no convencionales al Sistema Energético Nacional",
      note: "Marco legal principal para energías renovables",
    },
    {
      title: "Ley 2099 de 2021",
      description:
        "Dicta disposiciones para la transición energética, el dinamismo del mercado energético y otras disposiciones",
      note: "Actualización y modernización del marco normativo",
    },
  ];

  const resoluciones = [
    {
      title: "Resolución CREG 030 de 2018",
      description:
        "Regula actividad de autogeneración a pequeña escala y generación distribuida",
      note: "Permite venta de excedentes a la red",
    },
    {
      title: "Resolución CREG 174 de 2021",
      description:
        "Define metodología para cálculo de costos de conexión",
      note: "Clarifica costos de conexión al sistema",
    },
  ];
  const normas = [
    {
      title: "NTC 2050 (RETIE)",
      description: "Reglamento Técnico de Instalaciones Eléctricas",
      note: "Estándares de seguridad en instalaciones",
    },
    {
      title: "NTC 5746",
      description: "Sistemas fotovoltaicos conectados a la red eléctrica",
      note: "Especificaciones técnicas de sistemas solares",
    },
  ];

  const incentivos = [
    {
      title: "Deducción de Renta",
      description:
        "Hasta 50% del valor de la inversión deducible del impuesto de renta",
      note: "Beneficio tributario por 5 años",
    },
    {
      title: "Exclusión de IVA",
      description:
        "Equipos destinados a generación renovable exentos de IVA",
      note: "Reducción de costos de implementación",
    },
    {
      title: "Exención Arancelaria",
      description:
        "No pago de aranceles para importación de equipos y maquinaria",
      note: "Aplicable a equipos no producidos en Colombia",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        {/* Encabezado */}
        <span className="inline-block bg-gray-300 text-red-600 font-semibold px-4 py-1 rounded-full text-sm mb-3">
          Marco Legal
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Normativas y Regulaciones
        </h2>
        
        <p className="text-gray-900 mb-10">
          Información simplificada sobre las leyes, resoluciones e incentivos que
          rigen la implementación de energías renovables en Colombia
        </p>

        {/* Acordeones */}
        <Accordion
          icon={Scale}
          color="bg-red-200"
          title="Leyes y Decretos"
          items={leyes}
        />
        <Accordion
          icon  =  {FileText}
          color="bg-blue-200"
          title="Resoluciones CREG"
          items={resoluciones}
        />
        
        <Accordion
          icon={BookOpen}
          color="bg-green-100"
          title="Normas Técnicas"
          items={normas}
        />
        <Accordion
          icon={Award}
          color="bg-yellow-200"
          title="Incentivos"
          items={incentivos}
        />

        {/* Fuentes Oficiales */}
        <FuentesOficiales />

        {/* Nota Final */}
        <Nota />
      </section>
    </div>
  );
}
