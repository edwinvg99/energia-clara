import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  BarChart2,
  Droplets,
  Wind,
  DollarSign,
  ArrowUpDown,
  Flame,
  X,
  Info,
} from "lucide-react";
import API_URL from "../api";

/* ─── Colores por métrica ─────────────────────────────────── */
const COLOR_CONFIG = {
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    bar: "bg-emerald-400",
    badge: "bg-emerald-100 text-emerald-800",
  },
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    bar: "bg-blue-400",
    badge: "bg-blue-100 text-blue-800",
  },
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    bar: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800",
  },
  cyan: {
    bg: "bg-cyan-500",
    light: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    bar: "bg-cyan-400",
    badge: "bg-cyan-100 text-cyan-800",
  },
  rose: {
    bg: "bg-rose-500",
    light: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    bar: "bg-rose-400",
    badge: "bg-rose-100 text-rose-800",
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    bar: "bg-purple-400",
    badge: "bg-purple-100 text-purple-800",
  },
  orange: {
    bg: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    bar: "bg-orange-400",
    badge: "bg-orange-100 text-orange-800",
  },
  teal: {
    bg: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    bar: "bg-teal-400",
    badge: "bg-teal-100 text-teal-800",
  },
};

/* ─── Iconos ──────────────────────────────────────────────── */
const METRIC_ICONS = {
  Gene: Zap,
  DemaSIN: Activity,
  PPPrecBolsNaci: DollarSign,
  VoluUtilDiarEner: Droplets,
  factorEmisionCO2e: Wind,
  ENFICC: BarChart2,
  PerdidasEner: Flame,
  GeneIdea: ArrowUpDown,
};

/* ─── Descripciones educativas ────────────────────────────── */
const METRIC_INFO = {
  Gene: {
    titulo: "Generación Total del SIN",
    descripcion:
      "Es la energía eléctrica total producida por todas las plantas del Sistema Interconectado Nacional durante el día: hidráulicas, térmicas, solares, eólicas y de cogeneración.",
    contexto:
      "Colombia genera el 65–70% de su electricidad con agua. Por eso este indicador sube en temporadas de lluvias (alta hidrología) y puede bajar en períodos de sequía como el fenómeno de El Niño.",
    dato: "💡 Un día típico en Colombia, el SIN genera entre 140 y 200 GWh de energía eléctrica.",
  },
  DemaSIN: {
    titulo: "Demanda del SIN",
    descripcion:
      "La energía eléctrica total consumida en Colombia a través del SIN. Incluye usuarios regulados (hogares, pequeños comercios) y no regulados (grandes industrias), pero excluye el alumbrado público.",
    contexto:
      "La demanda refleja directamente la actividad económica del país. Sube en días laborables y en horas pico (6–9 am y 6–9 pm), y baja los fines de semana y festivos.",
    dato: "💡 La demanda energética de Colombia ha crecido cerca del 2–3% anual en la última década.",
  },
  PPPrecBolsNaci: {
    titulo: "Precio de Bolsa Nacional (Ponderado)",
    descripcion:
      "El precio promedio ponderado al que se transó la energía en la bolsa mayorista de Colombia. Es el precio que paga un comercializador cuando no tiene suficientes contratos para cubrir su demanda.",
    contexto:
      "Cuando hay abundancia de agua y los embalses están llenos, el precio cae porque las hidroeléctricas tienen bajo costo marginal. Cuando entra generación térmica (más costosa), el precio sube notoriamente.",
    dato: "💡 Los precios de bolsa en Colombia pueden variar de menos de 100 a más de 600 COP/kWh dependiendo de la hidrología.",
  },
  VoluUtilDiarEner: {
    titulo: "Volumen Útil Diario de Embalses",
    descripcion:
      "El agua almacenada en los embalses del SIN, expresada en energía equivalente (kWh). Representa cuánta electricidad se podría generar con el agua disponible hoy.",
    contexto:
      'Es el indicador de "salud hídrica" del sistema. Si el volumen cae por debajo del 30–40% de la capacidad útil, se activan alertas de desabastecimiento, el precio de bolsa sube y se pueden aplicar restricciones.',
    dato: "💡 Los principales embalses del SIN están en los ríos Magdalena, Cauca, Nare y Sogamoso.",
  },
  factorEmisionCO2e: {
    titulo: "Factor de Emisión de CO₂",
    descripcion:
      "Los gramos de CO₂ equivalente emitidos por cada kWh de electricidad generado en el SIN. Indica qué tan limpia es la matriz energética en un momento dado.",
    contexto:
      "Colombia tiene uno de los menores factores de emisión eléctrica de América Latina gracias a su matriz predominantemente hidráulica. El valor sube cuando las termoeléctricas de carbón o gas generan más (sequías, fallas en plantas hidráulicas).",
    dato: "💡 El factor de emisión eléctrico de Colombia (~130–200 gCO₂e/kWh) es mucho menor que el promedio mundial (~450 gCO₂e/kWh).",
  },
  ENFICC: {
    titulo: "Energía en Firme para el Cargo por Confiabilidad",
    descripcion:
      "La máxima energía que una planta de generación puede entregar continuamente bajo condiciones de hidrología crítica (año muy seco). Es la base del mecanismo de confiabilidad del sistema eléctrico colombiano.",
    contexto:
      "A través del Cargo por Confiabilidad (CxC), las plantas que se comprometen a entregar su ENFICC reciben un pago que les permite mantenerse disponibles. Esto garantiza el suministro incluso en años de sequía extrema.",
    dato: "💡 El ENFICC fue creado por la CREG para reemplazar el antiguo Cargo por Capacidad y mejorar las señales de inversión en generación.",
  },
  PerdidasEner: {
    titulo: "Pérdidas de Energía en Transmisión",
    descripcion:
      "La energía que se pierde durante el transporte desde las plantas generadoras hasta los puntos de consumo, principalmente por el calentamiento de los cables (efecto Joule) en el Sistema de Transmisión Nacional.",
    contexto:
      "Las pérdidas son inevitables en todo sistema eléctrico, pero se minimizan usando altas tensiones (230–500 kV). Las pérdidas en distribución (redes locales) son adicionales y mayores. Reducirlas es clave para la eficiencia energética.",
    dato: "💡 Las pérdidas técnicas en transmisión en Colombia representan aproximadamente el 2–4% de la energía total generada.",
  },
  GeneIdea: {
    titulo: "Generación Ideal del SIN",
    descripcion:
      "La generación eléctrica que resultaría si la red de transmisión no tuviera restricciones — como si las líneas fueran infinitas y no hubiera cuellos de botella entre regiones.",
    contexto:
      "Al comparar la Generación Ideal con la Generación Real se puede cuantificar el impacto de las restricciones de red. Cuando difieren mucho, significa que hay plantas que quieren generar (generalmente más baratas o renovables) pero no pueden porque la línea no da abasto.",
    dato: "💡 Las restricciones de red tienen un costo millonario anual para el sistema y son un argumento central para invertir en expansión de la red de transmisión.",
  },
};

/* ─── Helpers ─────────────────────────────────────────────── */
function formatValor(valor, unidad) {
  if (valor === null || valor === undefined) return "N/D";
  if (unidad === "kWh" || unidad === "MWh" || unidad === "GWh") {
    if (valor >= 1_000_000_000)
      return `${(valor / 1_000_000_000).toFixed(2)} TWh`;
    if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(2)} GWh`;
    if (valor >= 1_000) return `${(valor / 1_000).toFixed(1)} MWh`;
    return `${Math.round(valor)} kWh`;
  }
  if (unidad === "COP/kWh")
    return `$${valor.toLocaleString("es-CO", { maximumFractionDigits: 2 })} COP/kWh`;
  if (unidad === "gCO2e/kWh") return `${valor.toFixed(1)} gCO₂e/kWh`;
  if (unidad === "tCO2/MWh") return `${valor.toFixed(4)} tCO₂/MWh`;
  return valor.toFixed(2);
}

function formatFecha(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
}

/* ─── Sparkline ───────────────────────────────────────────── */
function Sparkline({ datos, barClass, height = "h-10" }) {
  const vals = (datos || [])
    .map((d) => d.valor)
    .filter((v) => v !== null && v !== undefined);
  if (vals.length === 0)
    return (
      <div
        className={`${height} flex items-center justify-center text-xs text-gray-300`}
      >
        Sin datos
      </div>
    );
  const max = Math.max(...vals);
  return (
    <div className={`flex items-end gap-px ${height}`}>
      {vals.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm opacity-80 ${barClass}`}
          style={{ height: `${max > 0 ? Math.max((v / max) * 100, 4) : 4}%` }}
        />
      ))}
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-10 bg-gray-100 rounded" />
    </div>
  );
}

/* ─── Card ────────────────────────────────────────────────── */
function IndicadorCard({ indicador, onClick }) {
  const cfg = COLOR_CONFIG[indicador.color] || COLOR_CONFIG.emerald;
  const Icon = METRIC_ICONS[indicador.metricId] || Activity;
  const { ultimo, promedio, variacion, fechaUltimo } = indicador.kpis || {};

  const variacionPositiva = variacion > 0;
  const variacionNula =
    variacion === null || variacion === undefined || isNaN(variacion);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border ${cfg.border} p-5 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group relative`}
    >
      {/* Hint de clic */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Info className="w-4 h-4 text-gray-400" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3 pr-6">
        <div className={`${cfg.bg} p-2 rounded-lg shrink-0`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            {indicador.label}
          </p>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${cfg.badge}`}
          >
            {indicador.unidad}
          </span>
        </div>
      </div>

      {/* Valor principal */}
      {indicador.error ? (
        <p className="text-sm text-rose-500 mb-2">No disponible</p>
      ) : (
        <>
          <p className={`text-2xl font-bold ${cfg.text} mb-0.5`}>
            {formatValor(ultimo, indicador.unidad)}
          </p>
          <p className="text-xs text-gray-400 mb-2">
            {fechaUltimo
              ? `Último dato: ${formatFecha(fechaUltimo)}`
              : "Sin fecha"}
          </p>

          {/* Variación */}
          <div className="flex items-center gap-1.5 mb-3">
            {variacionNula ? (
              <Minus className="w-3.5 h-3.5 text-gray-400" />
            ) : variacionPositiva ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span
              className={`text-xs font-medium ${variacionNula ? "text-gray-400" : variacionPositiva ? "text-emerald-600" : "text-rose-600"}`}
            >
              {variacionNula
                ? "Sin variación"
                : `${variacionPositiva ? "+" : ""}${variacion.toFixed(1)}% vs día anterior`}
            </span>
          </div>

          {/* Promedio + conteo */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">
              Prom.:{" "}
              <span className="font-medium text-gray-700">
                {formatValor(promedio, indicador.unidad)}
              </span>
            </p>
            <span className="text-xs text-gray-400">
              {indicador.datos?.length ?? 0} días
            </span>
          </div>

          <Sparkline datos={indicador.datos} barClass={cfg.bar} />
        </>
      )}
    </div>
  );
}

/* ─── Panel de detalle (drawer derecho) ───────────────────── */
function MetricDetail({ indicador, onClose }) {
  const open = !!indicador;
  const cfg = open
    ? COLOR_CONFIG[indicador.color] || COLOR_CONFIG.emerald
    : COLOR_CONFIG.emerald;
  const Icon = open ? METRIC_ICONS[indicador.metricId] || Activity : Activity;
  const info = open ? METRIC_INFO[indicador.metricId] || null : null;
  const { ultimo, promedio, variacion, fechaUltimo } =
    open && indicador.kpis ? indicador.kpis : {};
  const variacionPositiva = variacion > 0;
  const variacionNula =
    variacion === null || variacion === undefined || isNaN(variacion);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {open && (
          <>
            {/* Header del panel */}
            <div className={`${cfg.bg} px-6 py-5 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-wide font-medium">
                      Indicador
                    </p>
                    <h2 className="text-lg font-bold leading-tight">
                      {indicador.label}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Valor actual destacado */}
              {!indicador.error && (
                <div className="bg-white/10 rounded-xl px-4 py-3 mt-1">
                  <p className="text-3xl font-bold">
                    {formatValor(ultimo, indicador.unidad)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-white/70">
                      {fechaUltimo ? formatFecha(fechaUltimo) : "Sin fecha"}
                    </p>
                    {!variacionNula && (
                      <span
                        className={`text-sm font-semibold ${variacionPositiva ? "text-emerald-200" : "text-rose-200"}`}
                      >
                        {variacionPositiva ? "▲" : "▼"}{" "}
                        {Math.abs(variacion).toFixed(1)}% vs ayer
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Sparkline grande */}
              {!indicador.error && indicador.datos?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Evolución últimos {indicador.datos.length} días
                  </p>
                  <div className={`${cfg.light} rounded-xl p-3`}>
                    <Sparkline
                      datos={indicador.datos}
                      barClass={cfg.bar}
                      height="h-20"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 text-right">
                    Prom. período:{" "}
                    <span className="font-medium text-gray-600">
                      {formatValor(promedio, indicador.unidad)}
                    </span>
                  </p>
                </div>
              )}

              {/* Descripción educativa */}
              {info ? (
                <>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      ¿Qué es?
                    </p>
                    <h3 className="text-base font-bold text-gray-800 mb-2">
                      {info.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {info.descripcion}
                    </p>
                  </div>

                  <div
                    className={`${cfg.light} border ${cfg.border} rounded-xl p-4`}
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Contexto del mercado
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {info.contexto}
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {info.dato}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Sin descripción disponible para esta métrica.
                </p>
              )}

              {/* Unidad */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                  <span className="font-semibold">Unidad:</span>{" "}
                  {indicador.unidad} ·{" "}
                  <span className="font-semibold">Fuente:</span>{" "}
                  <a
                    href="https://sinergox.xm.com.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline"
                  >
                    SINERGOX XM
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── Página principal ────────────────────────────────────── */
export default function Indicadores() {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rangoDias, setRangoDias] = useState(7);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const fetchTodos = useCallback(async (dias) => {
    setIndicadores([]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/sinergox/indicadores?dias=${dias}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIndicadores(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos(rangoDias);
  }, [rangoDias, fetchTodos]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/api/sinergox/refresh`, { method: "POST" });
      await fetchTodos(rangoDias);
    } catch {
      await fetchTodos(rangoDias);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-6 h-6 text-emerald-400" />
                <h1 className="text-2xl font-bold">
                  Indicadores del{" "}
                  <span className="text-emerald-400">Mercado Eléctrico </span>
                </h1>
              </div>
              <p className="text-slate-300 text-sm max-w-xl">
                Datos del Sistema Interconectado Nacional (SIN) de Colombia,
                provistos por{" "}
                <a
                  href="https://sinergox.xm.com.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  XM S.A. E.S.P.
                </a>{" "}
                ·{" "}
                <span className="text-slate-400">
                  Haz clic en cualquier tarjeta para más información
                </span>
              </p>
            </div>
            {lastUpdate && (
              <p className="text-xs text-slate-400 sm:text-right">
                Actualizado: {lastUpdate.toLocaleTimeString("es-CO")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controles */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setRangoDias(d)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  rangoDias === d
                    ? "bg-slate-800 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {d} días
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <div>
              <p className="font-semibold text-red-700">
                No se pudo cargar los indicadores
              </p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchTodos(rangoDias)}
              className="mt-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && indicadores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {indicadores.map((ind) => (
              <IndicadorCard
                key={ind.metricId}
                indicador={ind}
                onClick={() => setSelectedMetric(ind)}
              />
            ))}
          </div>
        )}

        {/* Atribución */}
        {!loading && (
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Fuente de datos</p>
            <p>
              Datos provistos por{" "}
              <a
                href="https://sinergox.xm.com.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline font-medium"
              >
                SINERGOX — XM S.A. E.S.P.
              </a>
              , operador del SIN y administrador del Mercado de Energía
              Mayorista de Colombia. API documentada en{" "}
              <a
                href="https://github.com/EquipoAnaliticaXM/API_XM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline font-medium"
              >
                github.com/EquipoAnaliticaXM/API_XM
              </a>
              .
            </p>
          </div>
        )}
      </div>

      {/* Drawer de detalle */}
      <MetricDetail
        indicador={selectedMetric}
        onClose={() => setSelectedMetric(null)}
      />
    </div>
  );
}
