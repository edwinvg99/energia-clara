import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0b1220] text-slate-200 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Columna 1 */}
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center text-white mr-3 font-bold text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-lg text-white">Energía Clara</h3>
              <p className="text-emerald-200 text-sm">
                Información confiable sobre renovables
              </p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Plataforma informativa para combatir la desinformación sobre
            energías renovables en comunidades residenciales de Colombia.
          </p>
        </div>

        {/* Columna 2 */}
        <div>
          <h4 className="font-semibold text-white mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-emerald-400 transition">Inicio</a></li>
            <li><a href="/beneficios" className="hover:text-emerald-400 transition">Beneficios</a></li>
            <li><a href="/procesos" className="hover:text-emerald-400 transition">Proceso</a></li>
            <li><a href="/actores" className="hover:text-emerald-400 transition">Actores</a></li>
            <li><a href="/normativas" className="hover:text-emerald-400 transition">Normativas</a></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h4 className="font-semibold text-white mb-3">Sobre este Proyecto</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-400" />
              Trabajo de grado - Ingeniería de Software
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-emerald-400" />
              Colombia
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-emerald-400" />
              info@energiaclara.edu.co
            </li>
          </ul>
        </div>

        {/* Columna 4 */}
        <div>
          <h4 className="font-semibold text-white mb-3">Redes Sociales</h4>
          <p className="text-sm text-slate-400 mb-4">
            Síguenos para contenido educativo sobre energías renovables
          </p>
          <div className="flex gap-3">
            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-emerald-500 transition">
              <Facebook size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-emerald-500 transition">
              <Twitter size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-emerald-500 transition">
              <Instagram size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-emerald-500 transition">
              <Linkedin size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-emerald-500 transition">
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between text-slate-500">
        <p>© 2025 Energía Clara - Plataforma Informativa Académica sobre Energías Renovables en Colombia</p>
        <p>Proyecto Educativo</p>
      </div>
    </footer>
  );
}

export default Footer;
