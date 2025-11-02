import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, BookOpen, Users } from "lucide-react";

const HERO_IMAGE_URL =
  "https://www.thecircularlab.com/web/app/uploads/2024/07/post-tcl-energia-limpia.jpg";

function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white overflow-hidden">
      <section className="relative isolate min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt="Turbinas de energía renovable"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-950/95 via-slate-950/90 to-slate-900/75" />
        </div>

        <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-8 sm:py-12 lg:py-16">
            <div className="max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-500/40 shadow-lg backdrop-blur-sm w-fit">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Descubre cómo iniciar tu transición energética
              </span>

              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                Combatiendo la desinformación sobre{" "}
                <span className="text-emerald-400">energías renovables</span>
              </h1>

              {/* Description */}
              <p className="text-sm text-slate-300 sm:text-base lg:text-lg max-w-3xl">
                Accede a información confiable, clara y comprensible sobre
                procesos, beneficios, normativas y actores involucrados en la
                implementación de energías renovables en Colombia.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Link
                  to="/educativo"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 px-6 py-3 text-sm sm:text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  Módulos educativos
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link
                  to="/procesos"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  Ver procesos
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>

              {/* Feature Cards */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 pt-4 sm:pt-6 lg:pt-8">
                <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-500/20 p-2 ring-1 ring-emerald-500/40">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-emerald-400 text-sm sm:text-base">
                        Información verificada
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Fuentes oficiales y datos actualizados
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-500/20 p-2 ring-1 ring-emerald-500/40">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-emerald-400 text-sm sm:text-base">
                        Contenido educativo
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Módulos con certificados incluidos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-500/20 p-2 ring-1 ring-emerald-500/40">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-emerald-400 text-sm sm:text-base">
                        Para comunidades
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Recursos para proyectos locales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
