# Energía Clara

Plataforma educativa sobre energías renovables desarrollada para el Tecnológico de Antioquia - Institución Universitaria.

## Descripción

Energía Clara es una aplicación web diseñada para educar y concientizar sobre el uso de energías renovables. El proyecto cuenta con un sistema de autenticación completo y una interfaz moderna e intuitiva.

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

## Estructura del Proyecto

```
energia-clara/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Navbar.jsx
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
    │   └── auth.js
    ├── server.js         # Punto de entrada
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

## Seguridad

- Contraseñas hasheadas con bcryptjs
- Tokens JWT para autenticación
- Variables de entorno para datos sensibles
- Validación de datos en frontend y backend
- Protección CORS configurada

## API Endpoints

### Autenticación

```
POST /api/auth/register  - Registrar nuevo usuario
POST /api/auth/login     - Iniciar sesión
```

## Autores

Desarrollado para el Tecnológico de Antioquia - Institución Universitaria
