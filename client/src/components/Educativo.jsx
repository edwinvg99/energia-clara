import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  FileText,
  Link2,
  ClipboardList,
} from "lucide-react";
import { modulosEducativos } from "../data/modulosData";

const Educativo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── DARK HERO ── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4"></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Módulos <span className="text-emerald-400">Educativos</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl">
            Aprende sobre energías renovables y sostenibilidad energética. Cada
            módulo incluye contenido educativo, recursos y una evaluación con
            certificado digital.
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {modulosEducativos.map((modulo) => (
            <Link
              key={modulo.id}
              to={`/educativo/${modulo.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className={`${modulo.color} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{modulo.icono}</span>
                  <h2 className="text-2xl font-bold">{modulo.titulo}</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 text-lg mb-4">
                  {modulo.descripcion}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 gap-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      {modulo.contenido.length} secciones de contenido
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2">
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      Evaluación de {modulo.examen.length} preguntas
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      Certificado digital al aprobar
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2">
                    <Link2 className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      {modulo.recursos.length} recursos adicionales
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Tiempo estimado: 20–30 min
                  </span>
                  <span
                    className={`${modulo.color} text-white px-4 py-2 rounded-lg font-semibold text-sm`}
                  >
                    Comenzar →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Instrucciones */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            ¿Cómo funcionan los módulos?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">1.</span>
              <span>
                Selecciona un módulo y estudia el contenido cuidadosamente
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">2.</span>
              <span>
                Explora los recursos adicionales (videos, PDFs, enlaces)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">3.</span>
              <span>Realiza la evaluación de 5 preguntas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">4.</span>
              <span>
                Obtén tu certificado digital si apruebas con 3 o más respuestas
                correctas
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Educativo;
