# Integración energy-community-auth-sdk

Documentación técnica de la integración del SDK de autenticación centralizado de Energy Community en el proyecto Energía Clara.

---

## ¿Qué es el SDK?

`energy-community-auth-sdk` es un paquete npm creado por el equipo de Energy Community que centraliza la autenticación de todas las aplicaciones de la comunidad. Gestiona credenciales, sesiones, tokens de acceso, refresh tokens y recuperación de contraseña.

- **appId:** `energia-clara`
- **Repositorio del SDK:** https://github.com/Santiago1809/energy-auth-sdk

---

## Arquitectura

```
Cliente React  →  Backend Express (proxy)  →  SDK  →  Servicio de Auth externo
                                          ↘  MongoDB (perfil extendido del usuario)
```

El SDK **siempre se usa desde el backend**, nunca desde el frontend. Esto protege la `apiKey` de ser expuesta en el navegador.

MongoDB sigue siendo la fuente de datos del perfil del usuario (universidad, ciudad, teléfono, dirección). El SDK guarda: email, firstName, lastName y contraseña.

---

## Cobertura completa del SDK

Todas las funciones expuestas por `energy-community-auth-sdk` están implementadas:

| Método SDK | Endpoint backend | Descripción |
|---|---|---|
| `sdk.auth.register()` | `POST /api/auth/register` | Registrar usuario |
| `sdk.auth.login()` | `POST /api/auth/login` | Iniciar sesión |
| `sdk.auth.refresh()` | `POST /api/auth/refresh` | Renovar tokens |
| `sdk.auth.validate()` | `authMiddleware` | Validar token en rutas protegidas |
| `sdk.auth.logout()` | `POST /api/auth/logout` | Cerrar sesión |
| `sdk.auth.sessions()` | `GET /api/auth/sessions` | Listar sesiones activas |
| `sdk.auth.revokeSession()` | `DELETE /api/auth/sessions/:sessionId` | Revocar una sesión específica |
| `sdk.auth.getUserById()` | `GET /api/auth/user/:sdkId` | Consultar usuario por ID del SDK |
| `sdk.auth.requestPasswordRecovery()` | `POST /api/password/forgot-password` | Solicitar recuperación de contraseña |
| `sdk.auth.validateRecoveryToken()` | `GET /api/password/verify-token/:token` | Verificar token de recuperación |
| `sdk.auth.resetPassword()` | `POST /api/password/reset-password/:token` | Restablecer contraseña |

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `server/lib/sdkClient.js` | Nuevo — instancia singleton del SDK |
| `server/.env` | Nuevo campo `AUTH_SDK_API_KEY` |
| `server/models/User.js` | Nuevo campo `sdkUserId`; `password` ya no es required |
| `server/routes/auth.js` | Reescrito — login, register y gestión de sesiones via SDK |
| `server/routes/passwordReset.js` | Reescrito — recuperación de contraseña completamente via SDK |
| `server/middleware/auth.js` | Validación via `sdk.auth.validate()` en vez de `jwt.verify()` |
| `client/src/services/authService.js` | Nuevo — helpers `refreshAccessToken()` y `getAuthHeaders()` |
| `client/src/context/UserContext.jsx` | Logout llama al endpoint del SDK; claves de token actualizadas |
| `client/src/components/Login.jsx` | Guarda `accessToken` y `refreshToken` en vez de `token` |

**Sin cambios:** `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `App.jsx`, `Navbar.jsx`, rutas de chatbot/noticias/creg/simem/sinergox.

---

## Variables de entorno

Agregar en `server/.env`:

```
AUTH_SDK_API_KEY=<api-key-del-sdk>
```

---

## Manejo de errores del SDK

```js
import { AuthServiceSdkError } from 'energy-community-auth-sdk';

try {
  await sdk.auth.login({ email, password });
} catch (err) {
  if (err instanceof AuthServiceSdkError) {
    console.error('Status:', err.status);   // 400 | 401 | 403 | 404 | 409 | 429 | 0
    console.error('Message:', err.message); // descripción del error
  }
}
```

| Status | Significado |
|---|---|
| `400` | Datos inválidos (email mal formato, contraseña débil, etc.) |
| `401` | Credenciales incorrectas |
| `403` | API key inválida |
| `404` | Recurso no encontrado |
| `409` | Conflicto (email ya registrado, token ya usado) |
| `429` | Rate limit — demasiadas peticiones |
| `0` | Error de red (no se pudo conectar al servidor) |

---

## Referencia de endpoints

### `POST /api/auth/register`
Registra un usuario nuevo. Llama a `sdk.auth.register()` y guarda los datos extendidos en MongoDB.

**Body:**
```json
{
  "nombre": "Ada",
  "apellido": "Lovelace",
  "email": "ada@example.com",
  "password": "StrongPass123!",
  "universidad": "TDEA",
  "ciudad": "Medellín",
  "telefono": "3001234567",
  "direccion": "Calle 123"
}
```
**Respuesta 200:** `{ "message": "Usuario registrado exitosamente" }`

---

### `POST /api/auth/login`
Autentica al usuario via el SDK. Incluye migración automática de usuarios anteriores a la integración.

**Body:** `{ "email": "...", "password": "..." }`

**Respuesta 200:**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "nombre": "...", "apellido": "...", "email": "...", "universidad": "...", "ciudad": "..." }
}
```

---

### `POST /api/auth/refresh`
Renueva los tokens.

**Body:** `{ "refreshToken": "..." }`

**Respuesta 200:** `{ "accessToken": "...", "refreshToken": "..." }`

---

### `POST /api/auth/logout`
Cierra la sesión actual en el SDK.

**Header:** `Authorization: Bearer <accessToken>`

---

### `GET /api/auth/sessions`
Lista todas las sesiones activas del usuario.

**Header:** `Authorization: Bearer <accessToken>`

**Respuesta 200:** Array de `SessionResponse`.

---

### `DELETE /api/auth/sessions/:sessionId`
Revoca una sesión específica (cerrar sesión en otro dispositivo).

**Header:** `Authorization: Bearer <accessToken>`

---

### `GET /api/auth/user/:sdkId`
Consulta un usuario por su ID en el SDK.

---

### `POST /api/password/forgot-password`
El SDK envía el correo de recuperación directamente. Siempre responde con éxito aunque el email no exista (seguridad contra enumeración).

**Body:** `{ "email": "ada@example.com" }`

**Respuesta 200:** `{ "message": "Si el correo está registrado, recibirás un enlace de recuperación." }`

---

### `GET /api/password/verify-token/:token`
Verifica si un token de recuperación es válido y no ha sido usado.

**Respuesta 200:** `{ "valid": true }` o `{ "valid": false }`

---

### `POST /api/password/reset-password/:token`
Restablece la contraseña via el SDK y sincroniza el hash en MongoDB.

**Comportamiento importante:** el SDK revoca **todas las sesiones activas** automáticamente al restablecer la contraseña.

**Body:** `{ "password": "NuevaContraseña123!" }`

**Respuesta 200:** `{ "message": "Contraseña actualizada exitosamente. Ya puedes iniciar sesión." }`

**Error 409:** el token ya fue usado — solicitar uno nuevo.

---

## Flujo de recuperación de contraseña

```
Usuario              Frontend              Backend              SDK
  │                     │                    │                   │
  │── escribe email ────▶│                    │                   │
  │                     │─ POST /forgot ─────▶│                   │
  │                     │                    │─ requestPasswordRecovery() ─▶│
  │                     │                    │                   │ envía email
  │◀── "revisa tu correo"│◀─ { message } ─────│                   │
  │                     │                    │                   │
  │── abre link email ──▶│ /reset-password/:token                 │
  │                     │─ GET /verify-token ─▶│                  │
  │                     │                    │─ validateRecoveryToken() ───▶│
  │                     │◀─ { valid: true } ──│                   │
  │                     │                    │                   │
  │── nueva contraseña ─▶│                    │                   │
  │                     │─ POST /reset ───────▶│                  │
  │                     │                    │─ resetPassword() ──▶│
  │                     │                    │  (revoca sesiones) │
  │                     │                    │─ bcrypt + MongoDB sync        │
  │◀── redirige a /login │◀─ { message } ─────│                   │
```

---

## Cambio en la respuesta de login

**Antes (JWT local):**
```json
{ "token": "...", "user": { ... } }
```

**Ahora (SDK):**
```json
{ "accessToken": "...", "refreshToken": "...", "user": { ... } }
```

Los tokens se guardan en `localStorage` con las claves `accessToken` y `refreshToken`.

---

## Migración de usuarios existentes

Los usuarios registrados antes de esta integración se migran automáticamente en su primer login:

1. El SDK falla al hacer login (usuario desconocido)
2. El backend verifica las credenciales en MongoDB (bcrypt)
3. Si son válidas, registra al usuario en el SDK silenciosamente
4. Completa el login normalmente — el usuario no nota diferencia

---

## Uso de los helpers del frontend

```js
import { getAuthHeaders, refreshAccessToken } from '../services/authService';

// Incluir token en llamadas autenticadas
const res = await fetch(`${API_URL}/api/ruta-protegida`, {
  headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
});

// Renovar token cuando expira
if (res.status === 401) {
  const newToken = await refreshAccessToken();
  if (!newToken) navigate('/login'); // sesión expirada
}
```

---

## Instalación

```bash
cd server
npm install energy-community-auth-sdk
```
