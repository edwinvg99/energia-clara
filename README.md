# Energía Clara

Plataforma educativa sobre energías renovables desarrollada para el Tecnológico de Antioquia - Institución Universitaria.

## Descripción

Energía Clara es una aplicación web diseñada para educar y concientizar sobre el uso de energías renovables. Además del módulo educativo base, ahora integra un chatbot con IA, un agregador de noticias nacionales y un flujo completo de recuperación de contraseñas para garantizar disponibilidad durante el despliegue público.

## Tecnologías

### Frontend

- **React 19** - Librería de UI
- **React Router DOM** - Navegación
- **Tailwind CSS 4** - Estilos y diseño
- **Vite** - Build tool y dev server

### Backend

- **Node.js** - Runtime
- **Express** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Google Gemini API** - Respuestas del chatbot
- **Playwright + Cheerio** - Scraping de noticias
- **Nodemailer** - Envío de correos de recuperación

## Integraciones recientes

- **Chatbot IA**: Bot flotante en todas las vistas, combina preguntas predeterminadas y consultas libres usando Google Gemini (`client/src/components/Chatbot.jsx`, `server/routes/chatbot.js`).
- **Agregador de noticias**: Scrapers para MinEnergía, SER Colombia, Semana Sostenible y El Tiempo con caché y filtros (`client/src/components/Noticias.jsx`, `server/routes/noticias.js`).
- **Recuperación de contraseña**: Flujo completo con correo, token temporal y formulario de restablecimiento (`client/src/components/ForgotPassword.jsx`, `client/src/components/ResetPassword.jsx`, `server/routes/passwordReset.js`).

## Estructura del Proyecto

```
energia-clara/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Noticias.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── context/       # Context API
│   │   │   ├── UserContext.jsx
│   │   │   └── UserContextDef.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                # Backend Node.js
    ├── controllers/       # Lógica de negocio
    ├── models/           # Modelos de datos
    │   └── User.js
    ├── routes/           # Rutas de API
    │   ├── auth.js
    │   ├── chatbot.js
    │   ├── noticias.js
    │   └── passwordReset.js
    ├── server.js         # Punto de entrada
    ├── middleware/       # Middlewares (por ejemplo logging)
    ├── .env              # Variables de entorno
    └── package.json
```

## Instalación

### Prerequisitos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### Configuración

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd energia-clara
```

2. **Instalar dependencias del servidor**

```bash
cd server
npm install
```

3. **Instalar dependencias del cliente**

```bash
cd ../client
npm install
```

4. **Configurar variables de entorno**

Crear archivo `.env` en la carpeta `server/`:

```env
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=tu_api_key_de_gemini
EMAIL_USER=tu_correo_gmail
EMAIL_PASS=app_password
```

Crear archivo `.env` en `client/`:

```env
VITE_API_URL=http://localhost:5000
```

## Uso

### Iniciar el servidor (Backend)

```bash
cd server
npm run dev
```

El servidor se ejecutará en `http://localhost:5000`

### Iniciar el cliente (Frontend)

```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Variables de entorno

| Servicio | Variable           | Descripción                                           |
| -------- | ------------------ | ------------------------------------------------------ |
| Backend  | `MONGO_URI`      | Cadena de conexión a MongoDB Atlas o cluster propio   |
| Backend  | `JWT_SECRET`     | Llave para firmar tokens JWT                           |
| Backend  | `PORT`           | Puerto de Express (5000 por defecto)                   |
| Backend  | `FRONTEND_URL`   | URL pública del frontend, usada para enlaces de reset |
| Backend  | `GEMINI_API_KEY` | API key de Google Gemini para el chatbot               |
| Backend  | `EMAIL_USER`     | Cuenta Gmail/SMTP que envía correos                   |
| Backend  | `EMAIL_PASS`     | App password o credencial SMTP                         |
| Frontend | `VITE_API_URL`   | URL pública del backend                               |

## Despliegue

### Backend (Railway/Render/VPS)

1. Configura todas las variables anteriores en el panel del proveedor.
2. Instala dependencias (`npm install`) y ejecuta `npm run start`.
3. En entornos con noticias habilita Playwright (en Railway/Render se instala con `npm install`).
4. Verifica el estado con `GET /api/health`, `GET /api/chatbot/status` y `GET /api/noticias`.

### Frontend (Vercel/Netlify)

1. Define `VITE_API_URL` apuntando al backend.
2. Ejecuta `npm install` y `npm run build` 
3. Configura rewrites para SPA (`/* -> /index.html`).
4. Tras el deploy, valida que el chatbot y noticias funcionen sin errores CORS.

## Características

### Autenticación

- ✅ Registro de usuarios con validación completa
- ✅ Inicio de sesión seguro
- ✅ Tokens JWT para sesiones
- ✅ Encriptación de contraseñas

### Interfaz de Usuario

- Diseño moderno y responsivo
- Tema nocturno para Login (azules oscuros)
- Tema diurno para Register (verdes claros)
- Animaciones y transiciones suaves
- Compatible con dispositivos móviles

### Formularios

- Validación en tiempo real
- Mensajes de error descriptivos
- Autocompletado personalizado
- Selectores para universidad y ciudad
- Recuperación de contraseña con token temporal

## Seguridad

- Contraseñas hasheadas con bcryptjs
- Tokens JWT para autenticación
- Variables de entorno para datos sensibles
- Validación de datos en frontend y backend
- Protección CORS configurada

## API Endpoints

### Autenticación

```
POST /api/auth/register              - Registrar nuevo usuario
POST /api/auth/login                 - Iniciar sesión
POST /api/password/forgot-password   - Solicitar enlace de recuperación
POST /api/password/reset-password/:token - Restablecer contraseña
POST /api/chatbot/message            - Enviar preguntas al asistente IA
GET  /api/chatbot/predefined         - Listar preguntas predeterminadas
GET  /api/noticias                   - Obtener noticias agregadas
POST /api/noticias/refresh           - Forzar actualización del caché
```

## Autores

Desarrollado para el Tecnológico de Antioquia - Institución Universitaria
