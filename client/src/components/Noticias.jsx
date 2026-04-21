import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Search, Filter, Loader2, AlertTriangle, Globe } from 'lucide-react';
import API_URL from '../api';

const CATEGORIAS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'Gobierno', label: 'Gobierno' },
  { value: 'Medios', label: 'Medios' },
];

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [fuentes, setFuentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [fuenteFiltro, setFuenteFiltro] = useState('');
  const [cacheInfo, setCacheInfo] = useState(null);

  const fetchNoticias = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        await fetch(`${API_URL}/api/noticias/refresh`, { method: 'POST' });
      }

      const params = new URLSearchParams();
      if (categoriaFiltro) params.set('categoria', categoriaFiltro);
      if (fuenteFiltro) params.set('fuente', fuenteFiltro);
      if (busqueda.trim()) params.set('q', busqueda.trim());

      const res = await fetch(`${API_URL}/api/noticias?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setNoticias(data.noticias || []);
        setFuentes(data.fuentes || []);
        setCacheInfo(data.cache || null);
        setError('');
      } else {
        setError(data.error || 'Error al cargar noticias.');
      }
    } catch {
      setError('Error de conexión. Verifica que el servidor esté activo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, [categoriaFiltro, fuenteFiltro]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchNoticias();
  };

  const handleRefresh = () => {
    fetchNoticias(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── DARK HERO ── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            
          
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Noticias de  <span className="text-emerald-400">Energía</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl">
            Últimas noticias sobre energías renovables en Colombia, recopiladas automáticamente
            de fuentes oficiales y medios especializados.
          </p>
          {cacheInfo && (
            <p className="text-xs text-slate-400 mt-3">
              Última actualización: {new Date(cacheInfo.lastFetch).toLocaleString('es-CO')}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar noticias..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-300 text-gray-900 placeholder-gray-400 text-sm"
                />
              </div>
            </form>

            {/* Filtro categoría */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={categoriaFiltro}
                onChange={(e) => { setCategoriaFiltro(e.target.value); setLoading(true); }}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIAS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Filtro fuente */}
            <select
              value={fuenteFiltro}
              onChange={(e) => { setFuenteFiltro(e.target.value); setLoading(true); }}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todas las fuentes</option>
              {fuentes.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>

            {/* Botón refrescar */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500">Cargando noticias...</p>
          </div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron noticias</h3>
            <p className="text-gray-500">Intenta cambiar los filtros o actualizar las fuentes.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{noticias.length} noticias encontradas</p>

            {/* Grid de noticias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((noticia, index) => (
                <article
                  key={`${noticia.url}-${index}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Header con fuente */}
                  <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                      <img
                        src={noticia.logo}
                        alt=""
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 truncate">{noticia.fuente}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                      noticia.categoria === 'Gobierno'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {noticia.categoria}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="px-5 pb-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-3">
                      {noticia.titulo}
                    </h3>
                    {noticia.resumen && (
                      <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
                        {noticia.resumen}
                      </p>
                    )}
                    <a
                      href={noticia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs font-semibold mt-auto transition-colors"
                    >
                      Leer más
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Fuentes */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            Fuentes de información
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fuentes.map(f => (
              <div key={f.id} className="flex items-center gap-2 text-sm text-gray-600 py-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
                <span>{f.nombre}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  f.categoria === 'Gobierno' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                }`}>{f.categoria}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Noticias;
