import React from "react";

const HERO_IMAGE_URL =
  "https://www.thecircularlab.com/web/app/uploads/2024/07/post-tcl-energia-limpia.jpg";

function Home() {
  return (
    <div className="h-screen bg-slate-950 text-white overflow-hidden">
      <section className="relative isolate h-full">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt="Turbinas de energía renovable"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-950/95 via-slate-950/90 to-slate-900/75" />
        </div>

        <div className="relative h-full mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-28 md:flex-row md:items-center md:justify-between md:gap-16 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-500/40 shadow-lg inset-ring-2 inset-ring-emerald-200 p-10 ">
              Descubre cómo iniciar tu transición energética
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Combatiendo la desinformación sobre energías renovables
            </h1>

            <p className="text-base text-slate-200 sm:text-lg">
              Accede a información confiable, clara y comprensible sobre
              procesos, beneficios, normativas y actores involucrados en la
              implementación de energías renovables en Colombia. Una plataforma
              educativa pensada para comunidades y líderes locales.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#informacion"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 "
              >
                Explorar información
              </a>
              <a
                href="/procesos"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Ver procesos
              </a>
            </div>

            <div className="grid gap-4 text-sm sm:grid-cols-3 mt-20">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-emerald-500">
                  Información verificada
                </p>
                <p className="mt-1 text-slate-200/80">
                  Fuentes oficiales y datos actualizados para tomar decisiones
                  informadas.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-emerald-500">
                  Fuentes confiables
                </p>
                <p className="mt-1 text-slate-200/80">
                  Contenido curado con apoyo de expertos en transición
                  energética.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-emerald-500">
                  Para comunidades
                </p>
                <p className="mt-1 text-slate-200/80">
                  Recursos diseñados para liderar proyectos energéticos locales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
