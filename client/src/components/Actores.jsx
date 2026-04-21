import React from "react";
import {
  Building2,
  Zap,
  Briefcase,
  Users2,
  Landmark,
  GraduationCap,
  Lightbulb,
} from "lucide-react";

const categorias = [
  {
    Icono: Building2,
    iconColor: "text-blue-500",
    iconBoxBg: "bg-blue-50",
    titulo: "Instituciones Gubernamentales",
    items: [
      {
        nombre: "Ministerio de Minas y Energía",
        desc: "Define políticas energéticas nacionales y regula el sector",
      },
      {
        nombre: "UPME",
        desc: "Planifica y promueve el desarrollo energético del país",
      },
      {
        nombre: "CREG",
        desc: "Regula tarifas y condiciones del mercado energético",
      },
    ],
  },
  {
    Icono: Zap,
    iconColor: "text-orange-500",
    iconBoxBg: "bg-orange-50",
    titulo: "Operadores de Red",
    items: [
      {
        nombre: "Empresas Distribuidoras",
        desc: "Gestionan conexión a red, medición y distribución de energía",
      },
      {
        nombre: "XM - Operador del Sistema",
        desc: "Coordina la operación del Sistema Interconectado Nacional",
      },
    ],
  },
  {
    Icono: Briefcase,
    iconColor: "text-green-500",
    iconBoxBg: "bg-green-50",
    titulo: "Sector Privado",
    items: [
      {
        nombre: "Empresas Instaladoras",
        desc: "Diseñan, suministran e instalan sistemas renovables",
      },
      {
        nombre: "Fabricantes de Equipos",
        desc: "Proveen paneles solares, inversores y componentes",
      },
      {
        nombre: "Consultores Técnicos",
        desc: "Asesoran en viabilidad y diseño de proyectos",
      },
    ],
  },
  {
    Icono: Users2,
    iconColor: "text-purple-500",
    iconBoxBg: "bg-purple-50",
    titulo: "Comunidad",
    items: [
      {
        nombre: "Juntas de Acción Comunal",
        desc: "Representan intereses de la comunidad y gestionan proyectos",
      },
      {
        nombre: "Copropiedades",
        desc: "Administran bienes comunes y toman decisiones de inversión",
      },
      {
        nombre: "Usuarios Finales",
        desc: "Beneficiarios directos de la generación de energía",
      },
    ],
  },
  {
    Icono: Landmark,
    iconColor: "text-teal-500",
    iconBoxBg: "bg-teal-50",
    titulo: "Entidades Financieras",
    items: [
      {
        nombre: "Bancos",
        desc: "Ofrecen líneas de crédito para proyectos de energía renovable",
      },
      {
        nombre: "Findeter",
        desc: "Financia proyectos de infraestructura sostenible",
      },
    ],
  },
  {
    Icono: GraduationCap,
    iconColor: "text-indigo-500",
    iconBoxBg: "bg-indigo-50",
    titulo: "Academia y Sociedad Civil",
    items: [
      {
        nombre: "Universidades",
        desc: "Investigan, capacitan y asesoran en tecnologías renovables",
      },
      {
        nombre: "ONGs Ambientales",
        desc: "Promueven adopción de energías limpias y sostenibilidad",
      },
    ],
  },
];

const Actores = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Actores <span className="text-emerald-400"> involucrados</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Conoce quiénes participan en el ecosistema de energías renovables en
            Colombia y el rol de cada uno
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categorias.map((cat, index) => {
            const { Icono } = cat;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`${cat.iconBoxBg} p-2.5 rounded-lg flex-shrink-0`}
                  >
                    <Icono className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {cat.titulo}
                  </h3>
                </div>

                {/* Items list */}
                <ul className="space-y-0">
                  {cat.items.map((item, i) => (
                    <li key={i}>
                      {i > 0 && (
                        <div className="border-t border-gray-100 my-3" />
                      )}
                      <p className="font-medium text-gray-800 text-sm">
                        {item.nombre}
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {item.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom callout */}
        <div className="mt-10 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6 flex items-start gap-4">
          <div className="flex-shrink-0 bg-gradient-to-br from-purple-400 to-indigo-500 p-2.5 rounded-full">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base mb-2">
              Colaboración entre actores
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              La implementación exitosa de sistemas de energías renovables
              requiere la{" "}
              <span className="font-semibold">coordinación y cooperación</span>{" "}
              de todos estos actores. Cada uno desempeña un rol fundamental en
              diferentes etapas del proceso, desde la planeación hasta la
              operación del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actores;
