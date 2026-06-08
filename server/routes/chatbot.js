const express = require('express');
const router = express.Router();


// Límite global diario como red de seguridad para no agotar la cuota gratuita de Gemini (1500 RPD)
const RATE_LIMITS = {
  MAX_REQUESTS_PER_DAY_GLOBAL: 800,
  MAX_OUTPUT_TOKENS: 1024,
};

const rateLimitStore = {
  globalDaily: { count: 0, resetDate: new Date().toDateString() },
};

function checkRateLimit() {
  const today = new Date().toDateString();

  if (rateLimitStore.globalDaily.resetDate !== today) {
    rateLimitStore.globalDaily = { count: 0, resetDate: today };
  }

  if (rateLimitStore.globalDaily.count >= RATE_LIMITS.MAX_REQUESTS_PER_DAY_GLOBAL) {
    return {
      allowed: false,
      message: 'Se alcanzó el límite diario de consultas del asistente. Intenta mañana o usa las preguntas predeterminadas.',
      retryAfter: 'mañana'
    };
  }

  return { allowed: true };
}

function incrementRateLimit() {
  rateLimitStore.globalDaily.count++;
}

// ============================================================
// PREGUNTAS PREDETERMINADAS (no consumen API)
// ============================================================
const PREDEFINED_QA = {
  'beneficios': {
    question: '¿Cuáles son los beneficios de las energías renovables?',
    answer: `Las energías renovables ofrecen múltiples beneficios:\n\n• **Reducción de costos**: Ahorro de hasta 40% en facturas de energía con paneles solares.\n• **Impacto ambiental**: Reducción de 25 toneladas de CO₂ al año.\n• **Independencia energética**: Hasta 70% de autosuficiencia energética.\n• **Bienestar comunitario**: Valorización de propiedades en un +15%.\n• **Retorno de inversión**: Recuperación en 5-7 años con incentivos gubernamentales.\n• **Estabilidad tarifaria**: Garantía de hasta 20 años contra aumentos de tarifas.\n\nPuedes ver más detalles en la sección de **Beneficios** de nuestra plataforma.`
  },
  'proceso': {
    question: '¿Cuál es el proceso para implementar energías renovables?',
    answer: `El proceso de implementación consta de 5 pasos:\n\n1. **Evaluación Inicial**: Análisis del consumo energético, radiación solar y viabilidad técnica del sitio.\n2. **Socialización Comunitaria**: Reuniones informativas, resolución de dudas y generación de consenso.\n3. **Permisos y Licencias**: Trámites ante el operador de red, cumplimiento de normativa RETIE y aprobaciones.\n4. **Instalación**: Montaje de paneles, inversores, medidores bidireccionales y sistemas de protección.\n5. **Puesta en Marcha**: Pruebas, conexión a la red y capacitación a usuarios.\n\nEl tiempo total estimado es de 3 a 6 meses. Visita la sección **Proceso** para más información.`
  },
  'normativas': {
    question: '¿Qué normativas regulan las energías renovables en Colombia?',
    answer: `En Colombia, las principales normativas son:\n\n• **Ley 1715 de 2014**: Marco regulatorio para la integración de energías renovables no convencionales al sistema energético.\n• **Ley 2099 de 2021**: Ley de Transición Energética que fortalece incentivos y mecanismos.\n• **Resolución CREG 030 de 2018**: Regula la generación distribuida y autogeneración a pequeña escala.\n• **Normas NTC**: Estándares técnicos colombianos para instalaciones eléctricas.\n\n**Incentivos disponibles:**\n- Deducción de renta hasta 50% de la inversión\n- Exclusión de IVA en equipos\n- Exención de aranceles\n- Depreciación acelerada\n\nConsulta la sección **Normativas** para el detalle completo.`
  },
  'actores': {
    question: '¿Quiénes son los actores involucrados en la energía renovable?',
    answer: `Los principales actores en el ecosistema de energías renovables en Colombia son:\n\n• **Gobierno**: Ministerio de Energía, UPME (Unidad de Planeación Minero Energética), CREG (Comisión de Regulación de Energía y Gas).\n• **Operadores de red**: Empresas distribuidoras de energía eléctrica.\n• **Sector privado**: Empresas instaladoras, fabricantes de equipos, desarrolladores de proyectos.\n• **Comunidades**: Organizaciones comunitarias, asociaciones de vecinos, cooperativas.\n• **Entidades financieras**: Bancos y fondos que ofrecen líneas de crédito verde.\n• **Academia y ONGs**: Universidades, centros de investigación y organizaciones ambientales.\n\nMás información en la sección **Actores**.`
  },
  'transicion': {
    question: '¿Qué es la transición energética?',
    answer: `La transición energética es el proceso de transformación del sector energético, pasando de combustibles fósiles a energías renovables y limpias.\n\n**Pilares fundamentales:**\n• Eficiencia energética: Usar menos energía para las mismas actividades\n• Electrificación: Reemplazar combustibles fósiles por electricidad limpia\n• Energías renovables: Solar, eólica, hidráulica, geotérmica\n• Almacenamiento: Baterías y otras tecnologías\n• Redes inteligentes: Infraestructura moderna y digitalizada\n\nEn Colombia, representa una oportunidad para diversificar la matriz energética, reducir emisiones y promover desarrollo económico sostenible. Aprende más en nuestros **Módulos Educativos**.`
  },
  'autogeneracion': {
    question: '¿Cómo funciona la autogeneración de energía?',
    answer: `La autogeneración permite producir tu propia energía eléctrica con fuentes renovables.\n\n**Componentes principales:**\n• Paneles solares: Capturan la energía del sol\n• Inversor: Convierte corriente directa en alterna\n• Medidor bidireccional: Registra energía consumida y exportada\n• Sistema de protección: Garantiza seguridad eléctrica\n• Baterías (opcional): Almacenan energía para uso nocturno\n\n**Datos clave:**\n- Regulada por la Ley 1715 de 2014\n- Permite vender excedentes a la red\n- Retorno de inversión: 5 a 8 años\n- Incentivos tributarios disponibles\n\nExplora el módulo de **Autogeneración** en la sección educativa.`
  },
  'comunidades': {
    question: '¿Qué son las comunidades energéticas?',
    answer: `Las comunidades energéticas son asociaciones de ciudadanos, empresas o entidades que se unen para producir, consumir y gestionar energía renovable colectivamente.\n\n**Modelos disponibles:**\n• Cooperativas energéticas: Propiedad colectiva y democrática\n• Comunidades de energía renovable: Producción local compartida\n• Autogeneración compartida: Varios usuarios, un sistema\n• Micro-redes comunitarias: Infraestructura local independiente\n\n**Pasos para crear una:**\n1. Sensibilización y formación del grupo\n2. Estudios de viabilidad técnica y económica\n3. Definición de estructura legal\n4. Búsqueda de financiamiento\n5. Implementación y operación\n6. Monitoreo y mejora continua\n\nAprende más en el módulo **Comunidades Energéticas**.`
  },
  'generacion-distribuida': {
    question: '¿Qué es la generación distribuida?',
    answer: `La generación distribuida es la producción de energía eléctrica cerca de los puntos de consumo, usando fuentes renovables de pequeña y mediana escala.\n\n**Tipos según escala:**\n• Residencial: 1-10 kW (viviendas)\n• Comercial: 10-500 kW (tiendas, oficinas)\n• Industrial: 500 kW - 5 MW (fábricas)\n• Comunitaria: Proyectos de múltiples usuarios\n• Agrícola: Bombeo, riego, procesamiento\n\n**Beneficios:**\n- Reduce pérdidas por transmisión\n- Mayor confiabilidad del sistema eléctrico\n- Democratiza el acceso a energía renovable\n- Crea micro-economías energéticas locales\n\nRegulada por la Resolución CREG 030 de 2018. Más información en nuestros módulos educativos.`
  },
  'plataforma': {
    question: '¿Qué es Energía Clara y cómo funciona?',
    answer: `**Energía Clara** es una plataforma educativa del Tecnológico de Antioquia (TDEA) que combate la desinformación sobre energías renovables en Colombia.\n\n**¿Qué ofrece?**\n• Información verificada sobre beneficios, procesos, normativas y actores\n• 4 módulos educativos interactivos con exámenes\n• Certificados descargables en PDF al aprobar módulos\n• Sección de noticias con información actualizada de fuentes confiables\n• Chatbot inteligente para resolver tus dudas\n• Contenido basado en fuentes oficiales (MinEnergía, UPME, CREG)\n\n**Módulos disponibles:**\n1. Transición Energética\n2. Autogeneración\n3. Generación Distribuida\n4. Comunidades Energéticas\n\nRegístrate gratis para acceder a todo el contenido educativo y obtener certificados.`
  },
  'noticias': {
    question: '¿Dónde puedo ver noticias sobre energías renovables?',
    answer: `**Energía Clara** incluye una sección de **Noticias** con información actualizada sobre energías renovables en Colombia.\n\n**Fuentes confiables:**\n• Ministerio de Minas y Energía\n• SER Colombia (Asociación de Energías Renovables)\n• Semana Sostenible\n• El Tiempo - Medio Ambiente\n\n**Características:**\n- Noticias actualizadas sobre proyectos, políticas y tecnologías renovables\n- Filtros por categoría (Gobierno, Medios, Gremios)\n- Búsqueda por texto\n- Enlaces directos a artículos completos\n- Estadísticas por fuente\n\nAccede a la sección **Noticias** desde el menú principal para mantenerte informado sobre el sector energético colombiano.`
  },
  'certificados': {
    question: '¿Cómo obtengo un certificado?',
    answer: `Para obtener un certificado en Energía Clara:\n\n1. **Regístrate** con tu información (nombre, universidad, email)\n2. **Inicia sesión** en la plataforma\n3. **Accede** a la sección Educativo\n4. **Selecciona** un módulo y estudia el contenido\n5. **Presenta el examen** (5 preguntas de selección múltiple)\n6. **Aprueba** con mínimo 3/5 respuestas correctas\n7. **Descarga** tu certificado en PDF\n\nEl certificado incluye tu nombre, el módulo completado y el logo del Tecnológico de Antioquia (TDEA). Puedes completar los 4 módulos disponibles y obtener un certificado por cada uno.`
  }
};

// ============================================================
// CONTEXTO DEL SISTEMA PARA GEMINI
// ============================================================
const SYSTEM_CONTEXT = `Eres el asistente virtual de "Energía Clara", una plataforma educativa del Tecnológico de Antioquia (TDEA) sobre energías renovables en Colombia.

TU ROL:
- Responder preguntas sobre energías renovables, transición energética, normativas colombianas, autogeneración, generación distribuida y comunidades energéticas.
- Dar respuestas claras, concisas y en español.
- Basar tus respuestas en información verificada y actual sobre Colombia.
- Si no sabes algo o la pregunta está fuera del tema de energías renovables, indicar amablemente que solo puedes ayudar con temas de energías renovables.

CONTEXTO DE LA PLATAFORMA:
- Energía Clara combate la desinformación sobre energías renovables en Colombia.
- Normativas clave: Ley 1715/2014, Ley 2099/2021, Resolución CREG 030/2018.
- Incentivos: deducción de renta, exclusión de IVA, exención de aranceles, depreciación acelerada.
- Beneficios: 40% ahorro, 25 ton CO2/año evitadas, 70% autosuficiencia, ROI 5-7 años.

SECCIONES DE LA PLATAFORMA (puedes orientar al usuario a la sección correcta):
- Inicio: presentación general de Energía Clara.
- Beneficios: ahorros, retorno de inversión (5-7 años), impacto ambiental, estabilidad tarifaria.
- Proceso: las 5 etapas de implementación (evaluación inicial, socialización comunitaria, permisos y licencias, instalación, puesta en marcha).
- Actores: roles del ecosistema (MinEnergía, UPME, CREG, operadores de red, sector privado, comunidades, banca verde, academia y ONGs).
- Normativas: explica Ley 1715/2014, Ley 2099/2021, Resolución CREG 030/2018 e incentivos tributarios.
- Educativo: 4 módulos con examen y certificado descargable en PDF: Transición Energética, Autogeneración, Generación Distribuida y Comunidades Energéticas. Se aprueba con 3/5 respuestas correctas.
- Noticias: noticias actualizadas de fuentes oficiales (Ministerio de Minas y Energía, SER Colombia, Semana Sostenible, El Tiempo). Se puede filtrar por categoría y fuente.
- Documentos CREG: repositorio de documentos oficiales de la Comisión de Regulación de Energía y Gas (CREG): resoluciones, circulares, autos y proyectos regulatorios. Sirven para consultar de primera mano la regulación vigente del sector eléctrico y de gas en Colombia (tarifas, conexión, generación distribuida, autogeneración, mercado, etc.). La CREG es la entidad que regula y fija las reglas del mercado energético.
- Mercado de Energía (SIMEM): datos del mercado mayorista de energía. Muestra la generación por tipo de fuente (Hidráulica, Térmica, Solar, Eólica), el % de energía renovable de la matriz y cómo funciona el mercado mayorista en Colombia.
- Indicadores: indicadores del mercado eléctrico colombiano: precio de bolsa, factor de emisión de CO₂, volumen útil de embalses, y qué reflejan sobre la salud del sistema energético.

REGLAS:
- Responde SIEMPRE en español.
- Sé conciso (máximo 3-4 párrafos).
- Cuando sea relevante, sugiere secciones de la plataforma donde el usuario puede aprender más.
- NO inventes datos ni normativas.
- Si la pregunta no tiene nada que ver con energías renovables o la plataforma, responde amablemente que solo puedes ayudar con esos temas.`;

// ============================================================
// ENDPOINT PRINCIPAL DEL CHATBOT
// ============================================================
// Nombre legible de la sección según la ruta del frontend, para dar contexto a la IA
const ROUTE_SECTION_NAME = {
  '/': 'Inicio',
  '/beneficios': 'Beneficios',
  '/procesos': 'Proceso de implementación',
  '/actores': 'Actores clave',
  '/normativas': 'Normativas',
  '/noticias': 'Noticias',
  '/educativo': 'Módulos Educativos',
  '/documentos-creg': 'Documentos CREG',
  '/mercado-energia': 'Mercado de Energía (SIMEM)',
  '/indicadores': 'Indicadores del Mercado Eléctrico',
};

router.post('/message', async (req, res) => {
  try {
    const { message, predefinedKey, route } = req.body;

    // Si es una pregunta predeterminada, responder directamente (NO consume API)
    if (predefinedKey && PREDEFINED_QA[predefinedKey]) {
      return res.json({
        response: PREDEFINED_QA[predefinedKey].answer,
        source: 'predefined',
        remainingQueries: null // No aplica para predefinidas
      });
    }

    // Validar que haya un mensaje
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    // Verificar rate limits
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.message,
        retryAfter: rateCheck.retryAfter
      });
    }

    // Verificar que la API key esté configurada
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'El asistente de IA no está configurado. Por favor usa las preguntas predeterminadas.',
        fallbackToPredefined: true
      });
    }

    // Llamar a Gemini API.
    // Modelo configurable por env (GEMINI_MODEL). Por defecto gemini-2.5-flash-lite:
    //  - SÍ tiene cuota en el tier gratuito de este proyecto (gemini-2.0-flash da limit:0).
    //  - El "thinking" viene desactivado por defecto, así que NO se come maxOutputTokens
    //    (lo que con gemini-2.5-flash truncaba o vaciaba las respuestas).
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
      generationConfig: {
        maxOutputTokens: RATE_LIMITS.MAX_OUTPUT_TOKENS,
        temperature: 0.7,
      },
    });

    // Inyectar la sección donde está el usuario para respuestas contextuales
    const sectionName = route ? ROUTE_SECTION_NAME[route] : null;
    const systemPrompt = sectionName
      ? `${SYSTEM_CONTEXT}\n\nCONTEXTO ACTUAL: El usuario está viendo la sección "${sectionName}" de la plataforma. Si su pregunta es ambigua, interprétala en el contexto de esa sección.`
      : SYSTEM_CONTEXT;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Comportate según estas instrucciones: ' + systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Soy el asistente virtual de Energía Clara y responderé sobre energías renovables en Colombia siguiendo las indicaciones proporcionadas.' }],
        },
      ],
    });

    const result = await chat.sendMessage(message.trim());

    // Extraer el texto de forma segura: si la respuesta viene vacía (p. ej. truncada
    // o bloqueada), no lanzamos error genérico, devolvemos un mensaje útil.
    let response = '';
    try {
      response = result.response.text();
    } catch {
      response = '';
    }

    if (!response || response.trim().length === 0) {
      return res.json({
        response: 'No pude generar una respuesta completa para esa consulta. ¿Puedes reformularla o ser más específico? También puedes usar las preguntas sugeridas.',
        source: 'gemini',
        remainingQueries: null,
      });
    }

    incrementRateLimit();

    return res.json({
      response,
      source: 'gemini',
      remainingQueries: null
    });

  } catch (error) {
    // Log detallado para diagnóstico (modelo, cuota, status real de Gemini)
    console.error('Error en chatbot:', error?.message);
    if (error?.status) console.error('  -> status:', error.status);
    if (error?.statusText) console.error('  -> statusText:', error.statusText);
    if (error?.errorDetails) console.error('  -> errorDetails:', JSON.stringify(error.errorDetails));

    // Manejar errores específicos de Gemini
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({
        error: 'El servicio de IA está temporalmente saturado. Usa las preguntas predeterminadas mientras tanto.',
        fallbackToPredefined: true
      });
    }

    return res.status(500).json({
      error: 'Error al procesar tu pregunta. Intenta con las preguntas predeterminadas.',
      fallbackToPredefined: true
    });
  }
});

// Endpoint para obtener preguntas predeterminadas
router.get('/predefined', (req, res) => {
  const questions = Object.entries(PREDEFINED_QA).map(([key, value]) => ({
    key,
    question: value.question,
  }));
  res.json({ questions });
});

router.get('/status', (req, res) => {
  res.json({
    active: !!process.env.GEMINI_API_KEY,
    limits: null,
    predefinedAvailable: Object.keys(PREDEFINED_QA).length,
  });
});

module.exports = router;
