import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, FileText, AlertCircle, Clock } from 'lucide-react';
import API_URL from '../api';

const TIPO_COLORS = {
  RE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PR: 'bg-blue-50 text-blue-700 border-blue-200',
  CI: 'bg-amber-50 text-amber-700 border-amber-200',
  AU: 'bg-slate-50 text-slate-700 border-slate-200',
};

const TIPO_HEADER = {
  RE: 'from-emerald-600 to-emerald-700',
  PR: 'from-blue-600 to-blue-700',
  CI: 'from-amber-500 to-amber-600',
  AU: 'from-slate-600 to-slate-700',
};

function formatFecha(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DocumentosCREG() {
  const [categorias, setCategorias] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocumentos = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/api/creg/documentos`);
      if (!res.ok) throw new Error('Error al cargar los documentos');
      const data = await res.json();
      setCategorias(data.categorias || []);
      setUltimaActualizacion(data.ultimaActualizacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch(`${API_URL}/api/creg/refresh`, { method: 'POST' });
    await fetchDocumentos();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-500 rounded-lg p-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium tracking-wide uppercase">Documentos Oficiales</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Documentos CREG
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Últimas resoluciones, circulares y autos publicados por la Comisión de Regulación de Energía y Gas de Colombia.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="https://creg.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition"
            >
              <ExternalLink className="h-4 w-4" />
              creg.gov.co
            </a>
            {ultimaActualizacion && (
              <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Clock className="h-3.5 w-3.5" />
                Actualizado: {formatFecha(ultimaActualizacion)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Encabezado de sección + botón refresh */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Últimos documentos publicados</h2>
            <p className="text-slate-500 text-sm mt-1">Información obtenida directamente de la fuente oficial</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 rounded-lg px-3 py-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-14 bg-slate-200" />
                <div className="p-5 space-y-3">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="h-4 bg-gray-100 rounded w-full" />
                  ))}
                  <div className="h-9 bg-gray-100 rounded-lg w-28 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No se pudieron cargar los documentos</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md">{error}</p>
            <button
              onClick={fetchDocumentos}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de categorías */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categorias.map((cat) => (
              <div
                key={cat.tipo}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header de la tarjeta */}
                <div className={`bg-gradient-to-r ${TIPO_HEADER[cat.tipo] || 'from-slate-600 to-slate-700'} px-5 py-4`}>
                  <h3 className="text-white font-bold text-lg">{cat.nombre}</h3>
                  <span className="text-white/70 text-xs">{cat.documentos.length} documentos recientes</span>
                </div>

                {/* Lista de documentos */}
                <div className="px-5 py-4 space-y-2.5">
                  {cat.documentos.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">No se encontraron documentos.</p>
                  ) : (
                    cat.documentos.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block text-sm px-3 py-2 rounded-lg border transition hover:shadow-sm hover:-translate-y-0.5 ${TIPO_COLORS[cat.tipo] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
                      >
                        <span className="flex items-start gap-2">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-60" />
                          <span className="leading-snug">{doc.titulo}</span>
                        </span>
                      </a>
                    ))
                  )}
                </div>

                {/* Botón Ver más */}
                <div className="px-5 pb-5">
                  <a
                    href={cat.verMas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition hover:shadow-lg"
                  >
                    Ver más
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nota de atribución */}
        {!loading && !error && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-blue-700 text-sm">
              Esta información se obtiene directamente del sitio oficial de la{' '}
              <a href="https://creg.gov.co" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                CREG (creg.gov.co)
              </a>{' '}
              y se actualiza automáticamente cada hora. Para ver el documento completo, haz clic en el título.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentosCREG;
