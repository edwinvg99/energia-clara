const sdk = require('../lib/sdkClient');
const { AuthServiceSdkError } = require('energy-community-auth-sdk');

// In-memory cache: el SDK de auth llama a un servicio externo en Render
// que sufre cold-starts de 30-60s en plan free. Cachear las validaciones
// elimina ese golpe en navegaciones consecutivas del mismo usuario.
const TTL_OK_MS = 5 * 60 * 1000;   // tokens válidos: 5 min
const TTL_BAD_MS = 30 * 1000;       // tokens rechazados: 30 s
const MAX_ENTRIES = 5000;

const cache = new Map(); // token -> { expiresAt, ok, userId?, status?, code? }

function getCached(token) {
  const entry = cache.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(token);
    return null;
  }
  return entry;
}

function setCached(token, entry) {
  if (cache.size >= MAX_ENTRIES) {
    // Eviction simple: borra la primera entrada (la más vieja en orden de inserción)
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(token, entry);
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token requerido.' });
  }

  const accessToken = authHeader.split(' ')[1];

  const cached = getCached(accessToken);
  if (cached) {
    if (cached.ok) {
      req.userId = cached.userId;
      return next();
    }
    return res.status(cached.status).json({ message: cached.message, code: cached.code });
  }

  try {
    const result = await sdk.auth.validate({ accessToken });
    setCached(accessToken, {
      ok: true,
      userId: result.user?.id,
      expiresAt: Date.now() + TTL_OK_MS,
    });
    req.userId = result.user?.id;
    next();
  } catch (err) {
    if (err instanceof AuthServiceSdkError && err.status === 401) {
      setCached(accessToken, {
        ok: false,
        status: 401,
        message: 'Sesión expirada. Renueva tu token.',
        code: 'TOKEN_EXPIRED',
        expiresAt: Date.now() + TTL_BAD_MS,
      });
      return res.status(401).json({ message: 'Sesión expirada. Renueva tu token.', code: 'TOKEN_EXPIRED' });
    }
    // No cacheamos errores de red — pueden ser transitorios (cold start, timeout)
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
