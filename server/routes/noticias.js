/**
 * ============================================================
 * MÓDULO DE AGREGACIÓN DE NOTICIAS - ENERGÍA CLARA
 * ============================================================
 * Sistema de web scraping para recolectar noticias de energías
 * renovables y medio ambiente en Colombia desde fuentes oficiales
 * y medios especializados.
 *
 * Características:
 * - Scraping ligero con Axios + Cheerio (El Tiempo, Semana y SER
 *   son renderizados en servidor) y Playwright solo para Minenergía
 *   (tabla dinámica renderizada por JavaScript).
 * - Enriquecimiento de cada noticia con su fecha de publicación,
 *   resumen e imagen leídos de las etiquetas <meta> del artículo.
 * - Máximo 5 noticias por fuente, ordenadas de más reciente a más antigua.
 * - Sistema de caché para optimizar rendimiento.
 *
 * @module routes/noticias
 */

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { chromium } = require('playwright');

const router = express.Router();

// ============================================================
// CONFIGURACIÓN
// ============================================================

/**
 * Genera la URL del logo (favicon) de un dominio usando el servicio
 * de Google, que devuelve un ícono de forma fiable para casi cualquier
 * sitio. Evita depender de favicons rotos o bloqueados de cada fuente.
 */
function logoDe(dominio) {
  return `https://www.google.com/s2/favicons?domain=${dominio}&sz=64`;
}

/**
 * Fuentes de noticias sobre energías renovables y medio ambiente en Colombia.
 * Cada fuente declara el scraper que debe usarse para procesarla.
 */
const FUENTES = [
  {
    id: 'minenergia',
    nombre: 'Ministerio de Minas y Energía',
    url: 'https://www.minenergia.gov.co/es/sala-de-prensa/noticias-index/',
    logo: logoDe('minenergia.gov.co'),
    categoria: 'Gobierno',
    scraper: 'minenergia', // Tabla dinámica -> Playwright
  },
  {
    id: 'ser-colombia',
    nombre: 'SER Colombia',
    url: 'https://ser-colombia.org/prensa-menciones-en-prensa/',
    logo: logoDe('ser-colombia.org'),
    categoria: 'Gremio',
    scraper: 'ser',
  },
  {
    id: 'eltiempo-ambiente',
    nombre: 'El Tiempo - Medio Ambiente',
    url: 'https://www.eltiempo.com/vida/medio-ambiente',
    logo: logoDe('eltiempo.com'),
    categoria: 'Medios',
    scraper: 'eltiempo',
  },
  {
    id: 'semana-sostenible',
    nombre: 'Semana Sostenible',
    url: 'https://www.semana.com/sostenible/',
    logo: logoDe('semana.com'),
    categoria: 'Medios',
    scraper: 'semana',
  },
];

/**
 * Configuración del sistema de caché
 */
const CACHE_CONFIG = {
  ttl: 30 * 60 * 1000, // 30 minutos
  maxArticlesPorFuente: 5,
  resumeMaxLength: 300,
};

/**
 * Configuración de timeouts y reintentos
 */
const SCRAPING_CONFIG = {
  httpTimeout: 15000,
  articuloTimeout: 12000,
  playwrightTimeout: 60000,
  playwrightWaitForJs: 3000,
  playwrightPageLoadDelay: 2000,
};

// Caché en memoria
let noticiasCache = {
  data: [],
  lastFetch: 0,
  ttl: CACHE_CONFIG.ttl,
};

// ============================================================
// UTILIDADES
// ============================================================

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/**
 * Realiza petición HTTP con timeout y headers personalizados
 */
async function fetchWithTimeout(url, timeout = SCRAPING_CONFIG.httpTimeout) {
  return axios.get(url, {
    timeout,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
    },
  });
}

/**
 * Normaliza una URL relativa a absoluta
 */
function normalizeUrl(url, baseUrl) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  try {
    const base = new URL(baseUrl);
    return new URL(url, base.origin).href;
  } catch {
    return '';
  }
}

/**
 * Limpia espacios en blanco excesivos de un texto
 */
function cleanText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

/**
 * Convierte una fecha ISO (o Date) a texto en español: "29 de mayo de 2026".
 */
function isoToFechaEs(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/**
 * Parsea una fecha escrita en español a ISO. Soporta variantes como
 * "18 de Marzo de 2026" y "febrero 22 de 2023".
 */
function parseSpanishDate(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  const mes = MESES.findIndex((m) => t.includes(m));
  if (mes < 0) return null;
  const nums = t.match(/\d+/g);
  if (!nums) return null;
  const year = nums.find((n) => n.length === 4);
  const day = nums.find((n) => n.length <= 2);
  if (!year || !day) return null;
  const d = new Date(Date.UTC(+year, mes, +day));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Resuelve los campos de fecha (texto en español + ISO para ordenar)
 * a partir de lo que cada scraper haya podido extraer.
 */
function resolverFechas({ fecha, fechaISO }) {
  let iso = fechaISO || null;
  let display = fecha || null;

  // Si la fecha de display es texto en español, derivar el ISO.
  if (!iso && display) iso = parseSpanishDate(display);
  // Si solo tenemos ISO, generar el texto en español.
  if (iso && !display) display = isoToFechaEs(iso);

  return { fecha: display, fechaISO: iso };
}

/**
 * Crea objeto de noticia con estructura estandarizada
 */
function createArticle(data, fuente) {
  const { fecha, fechaISO } = resolverFechas({ fecha: data.fecha, fechaISO: data.fechaISO });
  return {
    titulo: cleanText(data.titulo),
    resumen: data.resumen ? cleanText(data.resumen).substring(0, CACHE_CONFIG.resumeMaxLength) : '',
    url: data.url,
    fecha,
    fechaISO,
    sector: data.sector || null,
    imagen: data.imagen || null,
    fuente: fuente.nombre,
    fuenteId: fuente.id,
    categoria: fuente.categoria,
    logo: fuente.logo,
    fechaScraping: new Date().toISOString(),
  };
}

/**
 * Lee las etiquetas <meta> de la página de un artículo para obtener
 * su fecha de publicación, resumen (og:description) e imagen (og:image).
 * Los artículos de El Tiempo y Semana se renderizan en servidor, así que
 * basta una petición HTTP ligera.
 */
async function fetchMetaArticulo(url) {
  try {
    const { data: html } = await fetchWithTimeout(url, SCRAPING_CONFIG.articuloTimeout);
    const $ = cheerio.load(html);
    const fechaISO =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[property="article:modified_time"]').attr('content') ||
      $('time[datetime]').first().attr('datetime') ||
      null;
    const resumen =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';
    const imagen = $('meta[property="og:image"]').attr('content') || '';
    return { fechaISO, resumen, imagen };
  } catch {
    return {};
  }
}

// ============================================================
// SCRAPERS ESPECIALIZADOS
// ============================================================

/**
 * Scraper para Ministerio de Minas y Energía (Playwright)
 * Sitio dinámico con tabla paginada renderizada por JavaScript.
 */
async function scrapeMinenergia(fuente) {
  const baseUrl = 'https://www.minenergia.gov.co';
  const articles = [];
  const seen = new Set();
  let browser = null;

  try {
    console.log('[Minenergía] Iniciando scraping con Playwright...');

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    await page.goto(fuente.url, { waitUntil: 'load', timeout: SCRAPING_CONFIG.playwrightTimeout });
    await page.waitForTimeout(SCRAPING_CONFIG.playwrightWaitForJs);

    await page.waitForSelector('#tabledataset', { timeout: 20000 });
    await page.waitForSelector('#tabledataset tr', { timeout: 20000 });
    await page.waitForTimeout(SCRAPING_CONFIG.playwrightPageLoadDelay);

    const rowsData = await page.$$eval('#tabledataset tr', (rows) =>
      rows.map((tr) => {
        const a = tr.querySelector('a[href]');
        const h4 = tr.querySelector('h4.news-list-item-title');
        const resumen = tr.querySelector('p.news-list-item-text');
        const meta = tr.querySelector('p.fs-6');
        const img = tr.querySelector('img');
        return {
          href: a ? a.getAttribute('href') : '',
          titulo: h4 ? h4.textContent : '',
          resumen: resumen ? resumen.textContent : '',
          meta: meta ? meta.textContent : '',
          imagen: img ? img.getAttribute('src') : '',
        };
      })
    );

    console.log(`[Minenergía] Encontradas ${rowsData.length} filas`);

    for (const item of rowsData) {
      if (articles.length >= CACHE_CONFIG.maxArticlesPorFuente) break;

      const titulo = cleanText(item.titulo);
      const resumen = cleanText(item.resumen);
      const meta = cleanText(item.meta);
      const href = (item.href || '').trim();

      if (!titulo || titulo.length < 10 || !href) continue;

      const link = normalizeUrl(href, baseUrl);
      if (!link || seen.has(link)) continue;

      // Parsear metadatos: "18 de Marzo de 2026. Minenergía, Bogotá. Sector: Energía"
      let fecha = null, sector = null;
      if (meta) {
        const parts = meta.split('.');
        if (parts.length > 0) fecha = parts[0].trim();
        const match = meta.match(/Sector:\s*([^\n.]*)/i);
        if (match) sector = match[1].trim();
      }

      const imagen = normalizeUrl((item.imagen || '').trim(), baseUrl);

      seen.add(link);
      articles.push(createArticle({ titulo, resumen, url: link, fecha, sector, imagen }, fuente));
    }

    console.log(`[Minenergía] Scraping completado: ${articles.length} noticias`);
  } catch (error) {
    console.error('[Minenergía] Error en scraping:', error.message);
  } finally {
    if (browser) await browser.close();
  }

  return articles;
}

/**
 * Scraper para SER Colombia - Menciones en prensa (Axios + Cheerio).
 * Sitio WordPress renderizado en servidor.
 */
async function scrapeSerColombia(fuente) {
  const articles = [];

  try {
    console.log('[SER Colombia] Iniciando scraping...');
    const { data: html } = await fetchWithTimeout(fuente.url);
    const $ = cheerio.load(html);
    const seen = new Set();

    $('div.container-grid.blog_masonry div.wgl_col-4.item').each((_, el) => {
      if (articles.length >= CACHE_CONFIG.maxArticlesPorFuente) return;

      const $el = $(el);
      const $a = $el.find('h3.blog-post_title a').first();
      const titulo = cleanText($a.text());
      let url = $a.attr('href') || '';
      const resumen = cleanText($el.find('div.blog-post_text > p').first().text());
      const fecha = cleanText($el.find('span.post_date').first().text());

      url = normalizeUrl(url, fuente.url);

      if (!titulo || titulo.length < 10) return;
      if (!url || seen.has(url)) return;

      seen.add(url);
      articles.push(createArticle({ titulo, resumen, url, fecha }, fuente));
    });

    console.log(`[SER Colombia] ${articles.length} noticias encontradas`);
  } catch (error) {
    console.error('[SER Colombia] Error en scraping:', error.message);
  }

  return articles;
}

/**
 * Scraper genérico basado en <article> para medios renderizados en servidor.
 * Extrae los enlaces de la portada de la sección y luego enriquece cada
 * noticia (fecha, resumen, imagen) leyendo las <meta> del artículo.
 *
 * @param {Object} fuente - Configuración de la fuente
 * @param {RegExp} urlPattern - Patrón que deben cumplir las URLs de artículo
 */
async function scrapeMedio(fuente, urlPattern) {
  const articles = [];

  try {
    console.log(`[${fuente.nombre}] Iniciando scraping...`);
    const { data: html } = await fetchWithTimeout(fuente.url);
    const $ = cheerio.load(html);
    const seen = new Set();
    const candidatos = [];

    $('article').each((_, el) => {
      if (candidatos.length >= CACHE_CONFIG.maxArticlesPorFuente) return;

      const $el = $(el);
      const $a = $el.find('a[href]').first();
      const titulo = cleanText($el.find('h1, h2, h3, h4').first().text());
      let url = $a.attr('href') || '';
      const imagen = $el.find('img').first().attr('src') || '';

      url = normalizeUrl(url, fuente.url);

      if (!titulo || titulo.length < 15) return;
      if (!url || seen.has(url)) return;
      if (urlPattern && !urlPattern.test(url)) return; // Solo artículos reales

      seen.add(url);
      candidatos.push({ titulo, url, imagen });
    });

    console.log(`[${fuente.nombre}] ${candidatos.length} artículos en portada, enriqueciendo...`);

    // Enriquecer cada artículo en paralelo con su fecha/resumen/imagen.
    const enriquecidos = await Promise.all(
      candidatos.map(async (c) => {
        const meta = await fetchMetaArticulo(c.url);
        return createArticle({
          titulo: c.titulo,
          url: c.url,
          resumen: meta.resumen || '',
          imagen: c.imagen || meta.imagen || null,
          fechaISO: meta.fechaISO || null,
        }, fuente);
      })
    );

    articles.push(...enriquecidos);
    console.log(`[${fuente.nombre}] ${articles.length} noticias encontradas`);
  } catch (error) {
    console.error(`[${fuente.nombre}] Error en scraping:`, error.message);
  }

  return articles;
}

// ============================================================
// FUNCIÓN PRINCIPAL DE RECOLECCIÓN
// ============================================================

/**
 * Ejecuta el scraper correspondiente a cada fuente.
 */
function ejecutarScraper(fuente) {
  switch (fuente.scraper) {
    case 'minenergia':
      return scrapeMinenergia(fuente);
    case 'ser':
      return scrapeSerColombia(fuente);
    case 'eltiempo':
      return scrapeMedio(fuente, /\/vida\/medio-ambiente\//);
    case 'semana':
      return scrapeMedio(fuente, /\/articulo\//);
    default:
      return scrapeMedio(fuente, null);
  }
}

/**
 * Recolecta noticias de todas las fuentes configuradas usando caché.
 */
async function recolectarNoticias() {
  const now = Date.now();

  if (noticiasCache.data.length > 0 && (now - noticiasCache.lastFetch) < noticiasCache.ttl) {
    console.log('[Noticias] Usando caché existente');
    return noticiasCache.data;
  }

  console.log('[Noticias] Iniciando recolección desde fuentes...');
  const startTime = Date.now();

  const resultados = await Promise.allSettled(FUENTES.map(ejecutarScraper));

  let todasNoticias = [];
  resultados.forEach((resultado, index) => {
    if (resultado.status === 'fulfilled') {
      todasNoticias = [...todasNoticias, ...resultado.value];
      console.log(`[Noticias] ${FUENTES[index].nombre}: ${resultado.value.length} artículos`);
    } else {
      console.error(`[Noticias] Error en ${FUENTES[index].nombre}:`, resultado.reason?.message);
    }
  });

  // Eliminar duplicados por URL
  const uniqueMap = new Map();
  todasNoticias.forEach((n) => {
    if (!uniqueMap.has(n.url)) uniqueMap.set(n.url, n);
  });

  // Ordenar de más reciente a más antigua (las que no tienen fecha van al final)
  const noticias = Array.from(uniqueMap.values()).sort((a, b) => {
    if (!a.fechaISO && !b.fechaISO) return 0;
    if (!a.fechaISO) return 1;
    if (!b.fechaISO) return -1;
    return new Date(b.fechaISO) - new Date(a.fechaISO);
  });

  noticiasCache = { data: noticias, lastFetch: now, ttl: CACHE_CONFIG.ttl };

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`[Noticias] Recolección completada en ${elapsedTime}s - Total: ${noticias.length} noticias`);

  return noticias;
}

// ============================================================
// ENDPOINTS DE LA API
// ============================================================

/**
 * GET /api/noticias
 * Query params: categoria, fuente, q
 */
router.get('/', async (req, res) => {
  try {
    const noticias = await recolectarNoticias();

    const { categoria, fuente, q } = req.query;
    let filtradas = noticias;

    if (categoria) {
      filtradas = filtradas.filter((n) => n.categoria.toLowerCase() === categoria.toLowerCase());
    }
    if (fuente) {
      filtradas = filtradas.filter((n) => n.fuenteId === fuente);
    }
    if (q) {
      const query = q.toLowerCase();
      filtradas = filtradas.filter(
        (n) => n.titulo.toLowerCase().includes(query) || n.resumen.toLowerCase().includes(query)
      );
    }

    res.json({
      total: filtradas.length,
      fuentes: FUENTES.map((f) => ({ id: f.id, nombre: f.nombre, categoria: f.categoria, logo: f.logo })),
      noticias: filtradas,
      cache: {
        lastFetch: new Date(noticiasCache.lastFetch).toISOString(),
        ttlMinutes: noticiasCache.ttl / 60000,
      },
    });
  } catch (error) {
    console.error('[Noticias] Error en endpoint GET /:', error.message);
    res.status(500).json({ error: 'Error al obtener noticias', message: error.message });
  }
});

/**
 * GET /api/noticias/fuentes
 */
router.get('/fuentes', (req, res) => {
  res.json({
    total: FUENTES.length,
    fuentes: FUENTES.map((f) => ({
      id: f.id,
      nombre: f.nombre,
      url: f.url,
      categoria: f.categoria,
      logo: f.logo,
      scraper: f.scraper,
    })),
  });
});

/**
 * POST /api/noticias/refresh
 */
router.post('/refresh', async (req, res) => {
  try {
    console.log('[Noticias] Forzando actualización de caché...');
    noticiasCache.lastFetch = 0;
    const noticias = await recolectarNoticias();
    res.json({
      success: true,
      message: 'Noticias actualizadas correctamente',
      total: noticias.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Noticias] Error al refrescar:', error.message);
    res.status(500).json({ success: false, error: 'Error al actualizar noticias', message: error.message });
  }
});

/**
 * GET /api/noticias/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const noticias = await recolectarNoticias();

    const porFuente = {};
    noticias.forEach((n) => { porFuente[n.fuenteId] = (porFuente[n.fuenteId] || 0) + 1; });

    const porCategoria = {};
    noticias.forEach((n) => { porCategoria[n.categoria] = (porCategoria[n.categoria] || 0) + 1; });

    res.json({
      total: noticias.length,
      porFuente,
      porCategoria,
      cache: {
        activo: (Date.now() - noticiasCache.lastFetch) < noticiasCache.ttl,
        lastFetch: new Date(noticiasCache.lastFetch).toISOString(),
        ttlMinutes: noticiasCache.ttl / 60000,
      },
      config: {
        fuentesActivas: FUENTES.length,
        maxArticlesPorFuente: CACHE_CONFIG.maxArticlesPorFuente,
      },
    });
  } catch (error) {
    console.error('[Noticias] Error en stats:', error.message);
    res.status(500).json({ error: 'Error al obtener estadísticas', message: error.message });
  }
});

module.exports = router;
