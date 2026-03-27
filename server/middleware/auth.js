const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT.
 * Verifica el token en el header Authorization (Bearer <token>).
 * Si es válido, agrega req.userId con el ID del usuario.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión expirada. Inicia sesión de nuevo.' });
    }
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
