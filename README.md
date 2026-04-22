# Energía Clara

Plataforma web educativa e informativa sobre el mercado de energía eléctrica en Colombia, desarrollada como proyecto de tesis para el Tecnológico de Antioquia - Institución Universitaria.

🔗 **Demo en producción:** [energia-clara-client.up.railway.app](https://energia-clara-client.up.railway.app)

---

## Descripción

Energía Clara es una aplicación full-stack que combina educación energética con datos reales del mercado eléctrico colombiano. Integra información del SIMEM, XM S.A. E.S.P., la CREG y fuentes de noticias del sector, presentada de forma accesible para usuarios no especializados.

---

## Funcionalidades

| Sección | Descripción |
|---|---|
| **Mercado de Energía** | Mix de generación eléctrica por tipo de fuente (SIMEM · dataset E17D25), con KPIs, gráficas y tabla para 7, 14 o 30 días |
| **Indicadores** | 8 indicadores clave del mercado mayorista en tiempo real: demanda, precio de bolsa, generación, embalses, emisiones CO₂ y más (XM · API BI) |
| **Documentos CREG** | Últimas resoluciones, proyectos, circulares y autos publicados por la Comisión de Regulación de Energía y Gas |
| **Noticias** | Agregador de noticias del sector energético (MinEnergía, SER Colombia, Semana Sostenible, El Tiempo) |
| **Módulo educativo** | Contenido sobre energías renovables, actores del mercado, procesos y normativas |
| **Chatbot IA** | Asistente contextual con Google Gemini que adapta sus respuestas según la sección activa |
| **Autenticación** | Registro, login con JWT y recuperación de contraseña por correo |

---

## Tecnologías

### Frontend
- **React 19** — UI
- **React Router DOM** — Navegación SPA
- **Tailwind CSS 4** — Estilos
- **Vite** — Build tool
- **Lucide React** — Iconografía

### Backend
- **Node.js / Express** — Servidor API REST
- **MongoDB / Mongoose** — Base de datos de usuarios
- **JWT + bcryptjs** — Autenticación segura
- **Axios + Cheerio** — Llamadas a APIs externas y scraping
- **Google Gemini API** — Motor del chatbot
- **Nodemailer** — Correos de recuperación de contraseña

### Infraestructura
- **Railway** — Despliegue de frontend y backend
- **Cloudflare Workers** — Proxy para la API de XM (`servapibi.xm.com.co`), necesario porque el dominio solo resuelve desde redes colombianas
- **MongoDB Atlas** — Base de datos en la nube

---

## Arquitectura de APIs en producción

```
Browser (usuario)
      │
      ▼
React SPA — Railway
      │
      ▼
Express API — Railway (USA)
      │
      ├── /api/simem/*      ──── httpsAgent + dns.resolve4 ───► www.simem.co
      ├── /api/sinergox/*   ──► Cloudflare Worker (Colombia) ──► servapibi.xm.com.co
      ├── /api/creg/*       ──────────────────────────────────► creg.gov.co
      ├── /api/chatbot/*    ──────────────────────────────────► Gemini API
      └── /api/noticias/*   ──────────────────────────────────► Fuentes de noticias
```

> `servapibi.xm.com.co` solo es resolvible desde ISPs colombianos. Se usa un Cloudflare Worker como intermediario ya que Cloudflare tiene nodos de borde en Colombia.

---

## Estructura del proyecto

```
energia-clara/
├── client/                       # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── SIMEM.jsx         # Mercado de energía
│   │   │   ├── Indicadores.jsx   # Indicadores XM
│   │   │   ├── DocumentosCREG.jsx
│   │   │   ├── Noticias.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── services/             # Servicios de API (sin usar en prod, reserva local)
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                       # Backend Express
    ├── routes/
    │   ├── simem.js              # Proxy SIMEM + caché + agregación
    │   ├── sinergox.js           # Proxy XM vía Cloudflare Worker + caché
    │   ├── creg.js               # Scraping CREG + caché
    │   ├── noticias.js           # Scraping noticias + caché
    │   ├── chatbot.js            # Gemini API + rate limiting
    │   ├── auth.js               # Registro y login
    │   └── passwordReset.js      # Recuperación de contraseña
    ├── models/
    │   └── User.js
    ├── server.js                 # Punto de entrada
    └── package.json
```

---

## Instalación local

### Requisitos
- Node.js v18 o superior
- MongoDB local o cuenta en MongoDB Atlas

### 1. Clonar el repositorio

```bash
git clone https://github.com/edwinvg99/energia-clara.git
cd energia-clara
```

### 2. Instalar dependencias

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Variables de entorno

Crear `server/.env`:

```env
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=tu_api_key_de_gemini
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=app_password_de_gmail
```

Crear `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Ejecutar en desarrollo

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## API Endpoints

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
POST /api/password/forgot-password
POST /api/password/reset-password/:token
```

### Mercado de Energía (SIMEM)
```
GET  /api/simem/generacion?dias=7     # Mix de generación (1–31 días)
POST /api/simem/refresh               # Invalidar caché
```

### Indicadores (XM vía Cloudflare Worker)
```
GET  /api/sinergox/indicadores?dias=7  # 8 métricas del mercado mayorista
POST /api/sinergox/refresh             # Invalidar caché
GET  /api/sinergox/listado-metricas    # Todas las métricas disponibles en XM
GET  /api/sinergox/test/:metricId      # Diagnóstico de una métrica
```

### Otros
```
GET  /api/creg/documentos             # Documentos recientes de la CREG
GET  /api/noticias                    # Noticias del sector energético
POST /api/chatbot/message             # Consulta al chatbot (Gemini)
GET  /api/chatbot/status              # Estado y límites del chatbot
```

---

## Despliegue en Railway

### Backend
1. Conectar el repositorio en Railway y apuntar a la carpeta `server/`
2. Agregar las variables de entorno del archivo `.env`
3. El servidor arranca automáticamente con `npm start`

### Frontend
1. Conectar el repositorio en Railway apuntando a `client/`
2. Definir `VITE_API_URL` con la URL pública del backend
3. Railway detecta Vite automáticamente y ejecuta el build

### Cloudflare Worker (requerido para indicadores)
1. Crear cuenta gratuita en [cloudflare.com](https://cloudflare.com) (sin tarjeta)
2. Ir a **Workers & Pages → Create Worker**
3. La URL generada debe coincidir con la constante `XM_PROXY` en `server/routes/sinergox.js`

---

## Seguridad
- Contraseñas hasheadas con bcryptjs
- Autenticación con JWT
- CORS restringido a orígenes permitidos
- Rate limiting global en el chatbot
- Variables de entorno para todas las credenciales

---

## Autores

Desarrollado para el **Tecnológico de Antioquia - Institución Universitaria**  
Semestre 10 · Proyecto de Tesis
