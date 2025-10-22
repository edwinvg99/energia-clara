import React from 'react';

const HERO_IMAGE_URL = 'https://www.thecircularlab.com/web/app/uploads/2024/07/post-tcl-energia-limpia.jpg'

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950/95 via-slate-200/90 to-slate-900/75 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt="Turbinas de energía renovable"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-950/95 via-slate-950/90 to-slate-900/75" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-28 md:flex-row md:items-center md:justify-between md:gap-16 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-500/40">
              Información clara para comunidades residenciales
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Combatiendo la desinformación sobre energías renovables
            </h1>

            <p className="text-base text-slate-200 sm:text-lg">
              Accede a información confiable, clara y comprensible sobre procesos, beneficios, normativas y actores involucrados en la implementación de energías renovables en Colombia. Una plataforma educativa pensada para comunidades y líderes locales.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#informacion"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 text-white"
              >
                Explorar información
              </a>
              <a
                href="#procesos"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Ver procesos
              </a>
            </div>

            <div className="grid gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-emerald-500">Información verificada</p>
                <p className="mt-1 text-slate-200/80">Fuentes oficiales y datos actualizados para tomar decisiones informadas.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-emerald-500">Fuentes confiables</p>
                <p className="mt-1 text-slate-200/80">Contenido curado con apoyo de expertos en transición energética.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-emerald-500">Para comunidades</p>
                <p className="mt-1 text-slate-200/80">Recursos diseñados para liderar proyectos energéticos locales.</p>
              </div>
            </div>
          </div>

          {/* <aside className="hidden w-full max-w-sm shrink-0 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:block">
            <h2 className="text-lg font-semibold text-emerald-200">Indicadores 2024</h2>
            <dl className="mt-6 space-y-4 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <dt>Proyectos activos</dt>
                <dd className="font-bold text-white">34</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Comunidades impactadas</dt>
                <dd className="font-bold text-white">+2,500</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Capacitaciones impartidas</dt>
                <dd className="font-bold text-white">86</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Ahorro estimado</dt>
                <dd className="font-bold text-white">28% anual</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-slate-200/70">
              Datos recopilados por el equipo de Energía Clara TDEA con base en proyectos piloto implementados en Antioquia y la región Caribe.
            </p>
          </aside> */}
        </div>
      </section>

      {/* <section id="informacion" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">¿Por qué Energía Clara?</h2>
        <p className="mt-4 max-w-3xl text-base text-slate-200">
          Centralizamos información técnica y social sobre energías renovables para comunidades que buscan iniciar o fortalecer proyectos de transición energética. Nuestro objetivo es derribar mitos, facilitar recursos técnicos y conectar con actores clave.
        </p>

        <div id="procesos" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10">
            <h3 className="text-lg font-semibold text-white">Guías paso a paso</h3>
            <p className="mt-2 text-sm text-slate-200/80">Entiende el proceso completo para implementar proyectos solares y eólicos en tu comunidad.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10">
            <h3 className="text-lg font-semibold text-white">Beneficios económicos</h3>
            <p className="mt-2 text-sm text-slate-200/80">Explora herramientas para estimar ahorros y modelos de financiación participativa.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10">
            <h3 className="text-lg font-semibold text-white">Marco normativo</h3>
            <p className="mt-2 text-sm text-slate-200/80">Accede a normativas actualizadas, incentivos tributarios y contactos institucionales.</p>
          </article>
        </div>
      </section> */}
    </div>
  );
}

export default Home;
