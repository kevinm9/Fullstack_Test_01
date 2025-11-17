# Frontend - Plataforma de Gestión de Proyectos

Aplicación web desarrollada con React 18, TypeScript, TailwindCSS y shadcn/ui para la gestión de proyectos colaborativa.

## Stack Tecnológico

- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v6** - Routing y navegación
- **Zustand** - Estado global (autenticación)
- **Axios** - Cliente HTTP
- **TailwindCSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos

## Características Implementadas

### ✅ Autenticación
- **Login** - Inicio de sesión con email y contraseña
- **Registro** - Creación de nuevas cuentas
- **Rutas Protegidas** - Middleware de autenticación
- **Persistencia** - Token JWT en localStorage
- **Auto-logout** - Redirección en caso de token expirado

### ✅ UI/UX
- **Diseño Responsivo** - Mobile-first con TailwindCSS
- **Componentes Reutilizables** - shadcn/ui (Button, Input, Card, Label)
- **Loading States** - Indicadores de carga
- **Manejo de Errores** - Mensajes de error amigables
- **Validación Frontend** - Validaciones en formularios

### ✅ Dashboard
- Layout profesional con header
- Información del usuario
- Tarjetas de estadísticas (placeholder)
- Botón de logout

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   └── ProtectedRoute.tsx
│   ├── lib/
│   │   ├── api.ts           # Cliente Axios configurado
│   │   └── utils.ts         # Utilidades (cn helper)
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── store/
│   │   └── authStore.ts     # Zustand store de autenticación
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Router principal
│   ├── main.tsx
│   └── index.css            # Estilos globales + Tailwind
├── .env                     # Variables de entorno
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

## Rutas Disponibles

- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/dashboard` - Dashboard principal (requiere autenticación)
- `/` - Redirige a `/dashboard` (o `/login` si no está autenticado)

## Características de Seguridad

- **JWT Token** - Almacenado en localStorage
- **Interceptores Axios** - Token automático en headers
- **Rutas Protegidas** - ProtectedRoute component
- **Auto-logout** - En caso de 401 Unauthorized
- **Validación Frontend** - Antes de enviar datos al backend

## Próximas Funcionalidades

- [ ] Gestión de Proyectos (CRUD)
- [ ] Gestión de Tareas (CRUD)
- [ ] Colaboradores en proyectos
- [ ] Estados y prioridades de tareas
- [ ] Búsqueda y filtros
- [ ] Dashboard con estadísticas reales
- [ ] Perfil de usuario editable

## Conexión con el Backend

La aplicación se conecta a la API REST en `http://localhost:8080` (configurable via `.env`).

Endpoints utilizados:
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Crear cuenta

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

## Convenciones de Código

- **Componentes**: PascalCase (`Login.tsx`, `Dashboard.tsx`)
- **Funciones/Variables**: camelCase (`handleSubmit`, `formData`)
- **Tipos**: PascalCase con `interface` (`User`, `AuthResponse`)
- **Imports**: Usar alias `@/` para imports absolutos
- **Estilos**: TailwindCSS utility classes

## Notas de Desarrollo

- TypeScript en modo `strict`
- Path aliases configurados (`@/` apunta a `src/`)
- Hot Module Replacement (HMR) habilitado
- shadcn/ui configurado con tema personalizable
- Dark mode preparado (clase `dark` en tailwind.config)
