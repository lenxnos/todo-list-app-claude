# TODO List App

Aplicación web full-stack de lista de tareas con autenticación, construida con React, Express, PostgreSQL y Docker.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite, TypeScript, shadcn/ui, Tailwind CSS |
| Routing | React Router v7 |
| Estado del servidor | @tanstack/react-query |
| Formularios | react-hook-form + zod |
| Notificaciones | Sonner |
| Backend | Express, TypeScript |
| ORM | Prisma |
| Autenticación | JWT (access + refresh tokens) |
| Base de datos | PostgreSQL 16 |
| Email (dev) | Nodemailer + Mailpit |
| Tests unitarios | Vitest, React Testing Library, MSW |
| Tests E2E | Playwright |
| Infraestructura | Docker Compose |

## Requisitos

- Node.js 22+
- Docker y Docker Compose

## Inicio rápido

```bash
# 1. Clonar y entrar al directorio
cd todo-list-app-claude

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar con Docker
docker compose up --build
```

La aplicación estará disponible en:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Mailpit (emails) | http://localhost:8025 |

## Desarrollo local (sin Docker)

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

El frontend en modo desarrollo corre en `http://localhost:5173` y hace proxy de `/api` al backend en el puerto 4000.

## Tests

```bash
# Backend - 20 tests unitarios (use cases)
cd backend && npm test

# Frontend - 13 tests unitarios/integración (componentes + hooks con MSW)
cd frontend && npm test

# E2E - requiere backend y frontend corriendo
cd frontend && npx playwright test
```

## Arquitectura

### Backend - Clean Architecture

```
backend/src/
├── domain/              # Interfaces puras (ports)
│   ├── entities/        # User, Todo
│   ├── repositories/    # UserRepository, TodoRepository
│   └── services/        # TokenService, HashService, EmailService
├── application/         # Lógica de negocio
│   ├── dtos/            # Schemas de validación (Zod)
│   └── use-cases/       # RegisterUser, LoginUser, CreateTodo, etc.
└── infrastructure/      # Implementaciones concretas
    ├── config/          # Variables de entorno (Zod)
    ├── database/        # Prisma client + repositorios
    ├── http/            # Express app, controllers, middlewares, routes
    └── services/        # JWT, bcrypt, nodemailer
```

### Frontend - Screaming Architecture

```
frontend/src/
├── features/            # Organizado por dominio
│   ├── auth/            # Login, Register, ForgotPassword, ResetPassword
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/
│   │   └── __tests__/
│   └── todos/           # Dashboard, TodoItem, Filters, CreateForm
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── schemas/
│       └── __tests__/
├── shared/              # Código compartido
│   ├── api/             # Axios client con interceptors
│   ├── components/      # ProtectedRoute, Layout
│   ├── context/         # AuthContext (tokens + usuario)
│   ├── lib/             # Utilidades (cn)
│   ├── types/           # User, Todo, ApiError
│   └── ui/              # Componentes shadcn/ui
└── mocks/               # MSW handlers para tests y desarrollo
```

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Rate Limit |
|--------|------|-------------|------------|
| POST | `/api/auth/register` | Crear cuenta | 5 req/15min |
| POST | `/api/auth/login` | Iniciar sesión | - |
| POST | `/api/auth/refresh` | Renovar tokens | - |
| POST | `/api/auth/logout` | Cerrar sesión | Auth |
| POST | `/api/auth/request-reset` | Solicitar reset de contraseña | - |
| POST | `/api/auth/reset-password` | Cambiar contraseña con token | - |

### Tareas (`/api/todos`) - requiere autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/todos?completed=false` | Listar tareas (pendientes por defecto) |
| POST | `/api/todos` | Crear tarea |
| PUT | `/api/todos/:id` | Actualizar tarea |
| DELETE | `/api/todos/:id` | Eliminar tarea |

## Funcionalidades principales

- **Autenticación**: Registro, login, logout con JWT (access + refresh token con rotación)
- **Recuperación de contraseña**: Envío de email con enlace de reset (Mailpit en desarrollo)
- **Rate limiting**: Protección contra bots en el endpoint de registro
- **Gestión de tareas**: Crear con título y descripción, marcar como completada, eliminar
- **Filtro de tareas**: Por defecto se muestran solo las pendientes, con opción de ver finalizadas
- **Deshacer completar**: Al marcar una tarea como completada aparece una notificación con botón "Deshacer" durante 5 segundos

## Docker

| Contenedor | Imagen | Puerto |
|------------|--------|--------|
| todo-claude-web | nginx:alpine | 3000 |
| todo-claude-api | node:22-alpine | 4000 |
| todo-claude-db | postgres:16-alpine | 5432 |
| todo-claude-mail | axllent/mailpit | 1025, 8025 |

## Variables de entorno

Ver `.env.example` para la lista completa. Las principales:

| Variable | Descripción |
|----------|-------------|
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |
| `POSTGRES_DB` | Nombre de la base de datos |
| `JWT_ACCESS_SECRET` | Secreto para tokens de acceso (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens (min 32 chars) |
| `SMTP_HOST` | Host SMTP (mailpit en dev) |
| `FRONTEND_URL` | URL del frontend (para emails y CORS) |
