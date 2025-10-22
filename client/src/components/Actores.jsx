import React from 'react'
import { Building2, Zap, Briefcase, Users2, Landmark, GraduationCap, Lightbulb } from "lucide-react";



const Actores = () => {
    const categorias = [
        {
            icon: <Building2 className="text-blue-500" size={28} />,
            color: "bg-blue-50",
            titulo: "Instituciones Gubernamentales",
            items: [
                { nombre: "Ministerio de Minas y Energía", desc: "Define políticas energéticas nacionales y regula el sector" },
                { nombre: "UPME", desc: "Planifica y promueve el desarrollo energético del país" },
                { nombre: "CREG", desc: "Regula tarifas y condiciones del mercado energético" },
            ],
        },
        {
            icon: <Zap className="text-orange-500" size={28} />,
            color: "bg-orange-50",
            titulo: "Operadores de Red",
            items: [
                { nombre: "Empresas Distribuidoras", desc: "Gestionan conexión a red, medición y distribución de energía" },
                { nombre: "XM - Operador del Sistema", desc: "Coordina la operación del Sistema Interconectado Nacional" },
            ],
        },
        {
            icon: <Briefcase className="text-green-500" size={28} />,
            color: "bg-green-50",
            titulo: "Sector Privado",
            items: [
                { nombre: "Empresas Instaladoras", desc: "Diseñan, suministran e instalan sistemas renovables" },
                { nombre: "Fabricantes de Equipos", desc: "Proveen paneles solares, inversores y componentes" },
                { nombre: "Consultores Técnicos", desc: "Asesoran en viabilidad y diseño de proyectos" },
            ],
        },
        {
            icon: <Users2 className="text-purple-500" size={28} />,
            color: "bg-purple-50",
            titulo: "Comunidad",
            items: [
                { nombre: "Juntas de Acción Comunal", desc: "Representan intereses de la comunidad y gestionan proyectos" },
                { nombre: "Copropiedades", desc: "Administran bienes comunes y toman decisiones de inversión" },
                { nombre: "Usuarios Finales", desc: "Beneficiarios directos de la generación de energía" },
            ],
        },
        {
            icon: <Landmark className="text-teal-500" size={28} />,
            color: "bg-teal-50",
            titulo: "Entidades Financieras",
            items: [
                { nombre: "Bancos", desc: "Ofrecen líneas de crédito para proyectos de energía renovable" },
                { nombre: "Findeter", desc: "Financia proyectos de infraestructura sostenible" },
            ],
        },
        {
            icon: <GraduationCap className="text-indigo-500" size={28} />,
            color: "bg-indigo-50",
            titulo: "Academia y Sociedad Civil",
            items: [
                { nombre: "Universidades", desc: "Investigan, capacitan y asesoran en tecnologías renovables" },
                { nombre: "ONGs Ambientales", desc: "Promueven adopción de energías limpias y sostenibilidad" },
            ],
        },
    ];

    return (
        <section id="actores" className="bg-gray-50 py-20">
            <div className="text-center mb-12">
                <span className="px-4 py-1 rounded-full text-sm bg-purple-100 text-purple-700 font-medium">Ecosistema</span>
                <h2 className="text-4xl font-bold mt-4 text-gray-900">Actores Involucrados</h2>
                <p className="text-gray-600 mt-2">
                    Conoce quiénes participan en el proceso de implementación de energías renovables y cuál es el rol de cada uno
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {categorias.map((cat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${cat.color}`}>{cat.icon}</div>
                            <h3 className="font-semibold text-gray-900">{cat.titulo}</h3>
                        </div>
                        <ul className="space-y-2">
                            {cat.items.map((item, i) => (
                                <li key={i}>
                                    <p className="font-medium text-gray-800">{item.nombre}</p>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-5xl mx-auto mt-20 px-6">
                <div className="flex items-start gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl shadow-sm p-8">
                    <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500">
                        <Lightbulb className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Colaboración entre actores</h3>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            La implementación exitosa de sistemas de energías renovables requiere la{" "}
                            <span className="font-semibold">coordinación y cooperación</span> de todos estos actores. Cada uno desempeña un rol fundamental
                            en diferentes etapas del proceso, desde la planeación hasta la operación del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Actores;