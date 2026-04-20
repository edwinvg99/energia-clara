import React, { useState, useEffect, useCallback } from 'react';
import { Zap, TrendingUp, Leaf, RefreshCw, AlertCircle, ExternalLink, Clock, BarChart2, Table2, Info } from 'lucide-react';
import API_URL from '../api';

// Clases Tailwind completas (no dinámicas) para que el bundler no las elimine
const TIPO_CONFIG = {
  'Hidráulica':    { bg: 'bg-blue-500',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500' },
  'Solar':         { bg: 'bg-amber-400',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-800',  dot: 'bg-amber-400' },
  'Eólica':        { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  'Térmica':       { bg: 'bg-rose-500',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-800',    dot: 'bg-rose-500' },
  'Cogeneración':  { bg: 'bg-purple-500',  text: 'text-purple-700',  badge: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  'Filo de Agua':  { bg: 'bg-cyan-500',    text: 'text-cyan-700',    badge: 'bg-cyan-100 text-cyan-800',    dot: 'bg-cyan-500' },
};
const DEFAULT_CFG = { bg: 'bg-slate-400', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' };

const TIPOS_RENOVABLES = new Set(['Solar', 'Eólica', 'Hidráulica', 'Filo de Agua']);

const RANGOS = [
  { label: '7 días', dias: 7 },
  { label: '14 días', dias: 14 },
  { label: '30 días', dias: 30 },
];

function cfg(tipo) { return TIPO_CONFIG[tipo] || DEFAULT_CFG; }

function formatMWh(n) {
  if (!n || isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} TWh`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)} GWh`;
  return `${Math.round(n).toLocaleString('es-CO')} MWh`;
}

function formatFecha(str) {
  if (!str) return '—';
  const parts = str.split('T')[0].split('-');
  if (parts.length !== 3) return str;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-gray-200 rounded-lg" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
      <div className="h-9 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

function BarSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-pulse space-y-5">
      {[80, 60, 45, 30, 20].map(w => (
        <div key={w}>
          <div className="flex justify-between mb-1.5">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-6 bg-gray-100 rounded-full" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

function SIMEM() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rangoDias, setRangoDias] = useState(7);
  const [vistaActiva, setVistaActiva] = useState('mix');

  const fetchDatos = useCallback(async (dias) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/api/simem/generacion?dias=${dias}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || `Error HTTP ${res.status}`);
      setDatos(data);
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setDatos(null);
    fetchDatos(rangoDias);
  }, [rangoDias, fetchDatos]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch(`${API_URL}/api/simem/refresh`, { method: 'POST' });
    await fetchDatos(rangoDias);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-500 rounded-lg p-2">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium tracking-wide uppercase">Datos en Tiempo Real</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Mercado de Energía SIMEM</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Generación eléctrica real por tipo de fuente en Colombia. Datos oficiales del
            Sistema de Información del Mercado de Energía Mayorista.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="https://www.simem.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition"
            >
              <ExternalLink className="h-4 w-4" />
              simem.co
            </a>
            {datos?.cache?.lastFetch && (
              <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Clock className="h-3.5 w-3.5" />
                Actualizado: {new Date(datos.cache.lastFetch).toLocaleString('es-CO')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Controles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Generación Real por Fuente</h2>
            <p className="text-slate-500 text-sm mt-1">Dataset E17D25 · Generación Real Estimada (MWh)</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Selector de rango */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
              {RANGOS.map(r => (
                <button
                  key={r.dias}
                  onClick={() => setRangoDias(r.dias)}
                  disabled={loading}
                  className={`px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${
                    rangoDias === r.dias
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 rounded-lg px-3 py-2 transition bg-white shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No se pudo cargar la información de SIMEM</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md">{error}</p>
            <button
              onClick={() => { setLoading(true); fetchDatos(rangoDias); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <KpiSkeleton /><KpiSkeleton /><KpiSkeleton />
          </div>
        ) : !error && datos?.kpis && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* KPI 1: Total generación */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-50 rounded-lg p-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">
                  Total generado · {formatFecha(datos.kpis.fechaUltimoDia)}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{formatMWh(datos.kpis.totalMWhUltimoDia)}</p>
              <p className="text-xs text-slate-400 mt-1">Generación Real Estimada</p>
            </div>

            {/* KPI 2: % Renovable */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-50 rounded-lg p-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">Porcentaje renovable</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{datos.kpis.pctRenovable}%</p>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${datos.kpis.pctRenovable}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Solar + Eólica + Hidráulica + Filo de Agua</p>
            </div>

            {/* KPI 3: Fuente dominante */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-50 rounded-lg p-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">Fuente dominante</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{datos.kpis.fuenteDominante}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${cfg(datos.kpis.fuenteDominante).badge}`}>
                {TIPOS_RENOVABLES.has(datos.kpis.fuenteDominante) ? 'Renovable' : 'No Renovable'}
              </span>
            </div>
          </div>
        )}

        {/* Toggle de vista */}
        {!loading && !error && datos && (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setVistaActiva('mix')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  vistaActiva === 'mix'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                Mix Energético
              </button>
              <button
                onClick={() => setVistaActiva('tabla')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  vistaActiva === 'tabla'
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Table2 className="h-4 w-4" />
                Por Día
              </button>
            </div>

            {/* Vista Mix Energético */}
            {vistaActiva === 'mix' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Mix energético — período completo</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Distribución acumulada por tipo de fuente · últimos {rangoDias} días
                </p>

                <div className="space-y-4">
                  {datos.resumenPorTipo.map(item => (
                    <div key={item.tipo}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${cfg(item.tipo).bg}`} />
                          <span className="text-sm font-medium text-slate-700">{item.tipo}</span>
                          {item.esRenovable && (
                            <span className="text-xs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                              Renovable
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-500">{formatMWh(item.totalMWh)}</span>
                          <span className={`text-sm font-bold ${cfg(item.tipo).text}`}>{item.pctDelTotal}%</span>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cfg(item.tipo).bg} rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                          style={{ width: `${Math.max(item.pctDelTotal, 1)}%` }}
                        >
                          {item.pctDelTotal > 6 && (
                            <span className="text-white text-xs font-bold">{item.pctDelTotal}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Barra apilada proporcional */}
                <div className="mt-8">
                  <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">
                    Vista proporcional del mix
                  </p>
                  <div className="flex h-8 rounded-xl overflow-hidden w-full">
                    {datos.resumenPorTipo.map(item => {
                      if (item.pctDelTotal === 0) return null;
                      return (
                        <div
                          key={item.tipo}
                          className={`${cfg(item.tipo).bg} flex items-center justify-center`}
                          style={{ width: `${item.pctDelTotal}%` }}
                          title={`${item.tipo}: ${item.pctDelTotal}%`}
                        >
                          {item.pctDelTotal > 8 && (
                            <span className="text-white text-xs font-bold truncate px-1">
                              {item.tipo.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Leyenda */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {datos.resumenPorTipo.map(item => (
                      <span key={item.tipo} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className={`w-2.5 h-2.5 rounded-sm ${cfg(item.tipo).bg}`} />
                        {item.tipo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Vista Tabla por Día */}
            {vistaActiva === 'tabla' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-slate-800">Generación diaria por tipo de fuente</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Valores en MWh · Más reciente primero</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Fecha</th>
                        {datos.resumenPorTipo.map(item => (
                          <th key={item.tipo} className="text-right px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                            <span className="flex items-center justify-end gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${cfg(item.tipo).bg}`} />
                              {item.tipo}
                            </span>
                          </th>
                        ))}
                        <th className="text-right px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...datos.mixPorDia].reverse().map((dia, idx) => (
                        <tr
                          key={dia.fecha}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition ${idx === 0 ? 'bg-emerald-50/30' : ''}`}
                        >
                          <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                            {formatFecha(dia.fecha)}
                            {idx === 0 && (
                              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                Reciente
                              </span>
                            )}
                          </td>
                          {datos.resumenPorTipo.map(item => (
                            <td key={item.tipo} className={`px-4 py-3 text-right ${cfg(item.tipo).text} font-medium tabular-nums`}>
                              {dia.porTipo[item.tipo]
                                ? formatMWh(Math.round(dia.porTipo[item.tipo]))
                                : <span className="text-slate-300">—</span>}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {formatMWh(dia.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Skeleton mix/tabla */}
        {loading && !error && (
          <>
            <div className="flex gap-2 mb-6">
              <div className="h-9 w-36 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <BarSkeleton />
          </>
        )}

        {/* Nota de atribución */}
        {!loading && !error && datos && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-blue-700 text-sm">
              Datos obtenidos del{' '}
              <a href="https://www.simem.co" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                SIMEM (simem.co)
              </a>
              {' '}— Sistema de Información del Mercado de Energía Mayorista de Colombia.
              Dataset <code className="bg-blue-100 px-1 rounded text-xs">E17D25</code> — Generación Real por Recurso.
              Actualización automática cada hora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SIMEM;
