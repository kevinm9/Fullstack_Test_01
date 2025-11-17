# Prueba Técnica - Fullstack Developer (Node.js + React)

¡Bienvenido(a) a la prueba técnica para el puesto de **Desarrollador Fullstack**!

Esta prueba evaluará tus habilidades en el desarrollo de aplicaciones full-stack modernas utilizando **Node.js**, **Express**, **React**, y bases de datos. Tendrás **48 horas** para completar el desafío.

---

## 📋 Descripción del Proyecto

Desarrollarás una **plataforma de gestión de proyectos y tareas colaborativa** donde los usuarios pueden:

- Registrarse e iniciar sesión de forma segura
- Crear y gestionar proyectos
- Asignar tareas a diferentes proyectos
- Colaborar con otros usuarios en proyectos compartidos
- Filtrar, buscar y ordenar tareas por diferentes criterios
- Ver estadísticas básicas de sus proyectos

---

## 🛠️ Stack Tecnológico Requerido

### Backend
- **Runtime**: Node.js (v18 o superior)
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL **o** MongoDB (elige una)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

### Frontend
- **Framework**: React (v18 o superior)
- **Lenguaje**: TypeScript
- **Routing**: React Router v6
- **Estilos**: TailwindCSS (preferencia)

### DevOps (Opcional)
- **Containerización**: Docker + Docker Compose

**Nota**: Puedes usar cualquier otra librería o herramienta que consideres necesaria. Documenta tus decisiones técnicas en el archivo `TECHNICAL_DECISIONS.md`.

---

## 📦 Funcionalidades Requeridas

### 1. Autenticación y Usuarios

**Backend:**
- Registro de usuarios con validación
- Login con generación de JWT
- Middleware de autenticación para proteger rutas
- Hash de contraseñas
- Endpoint para obtener perfil del usuario autenticado

**Frontend:**
- Formularios de registro y login con validaciones
- Almacenamiento del token de autenticación
- Rutas protegidas que requieren autenticación
- Redirección automática según estado de autenticación

---

### 2. Gestión de Proyectos

**Backend:**
- CRUD completo de proyectos
- Solo el creador del proyecto puede editarlo o eliminarlo
- Sistema de colaboradores: añadir usuarios a proyectos
- Paginación en listado de proyectos

**Frontend:**
- Lista de proyectos con diseño responsive
- Crear, editar y eliminar proyectos
- Búsqueda y filtrado de proyectos
- Gestión de colaboradores

---

### 3. Gestión de Tareas

**Backend:**
- CRUD completo de tareas
- Las tareas pertenecen a un proyecto
- Estados: "pendiente", "en progreso", "completada"
- Prioridades: "baja", "media", "alta"
- Asignar tareas a colaboradores del proyecto
- Filtros por estado, prioridad, proyecto, usuario asignado
- Ordenamiento flexible

**Frontend:**
- Visualización de tareas (lista, kanban, o tu propuesta)
- Crear, editar y eliminar tareas
- Cambiar estado de tareas
- Filtros interactivos
- Asignación de tareas a usuarios

---

### 4. Dashboard y Estadísticas

**Backend:**
- Endpoint con estadísticas del usuario:
  - Total de proyectos
  - Total de tareas
  - Tareas por estado
  - Otras métricas relevantes

**Frontend:**
- Dashboard con visualización de estadísticas
- Resumen de actividad del usuario

---

## 📊 Criterios de Evaluación

Tu proyecto será evaluado en base a:

| Criterio | Peso |
|----------|------|
| **Funcionalidad** | 30% |
| **Calidad del Código** | 25% |
| **Arquitectura y Diseño** | 15% |
| **Seguridad** | 10% |
| **UI/UX** | 10% |
| **Documentación** | 5% |
| **Testing** | 5% |

### Puntos Extra (hasta +30%)
- Docker implementation completa (+10%)
- Tests exhaustivos (+5%)
- Funcionalidades adicionales (+5%)
- CI/CD pipeline (+5%)
- Deploy en producción (+5%)

---

## 📝 Instrucciones de Entrega

1. **Fork del repositorio**: Crea un fork de este repositorio

2. **Rama de trabajo**:
   ```
   test/tu-nombre-completo
   ```

3. **Estructura del proyecto**:
   ```
   /
   ├── backend/
   ├── frontend/
   ├── TECHNICAL_DECISIONS.md    # Documenta tus decisiones aquí
   ├── docker-compose.yml         # (opcional)
   └── README.md                  # Actualiza con instrucciones de ejecución
   ```

4. **Documentación requerida**:
   - Actualiza este README con instrucciones de instalación y ejecución
   - Completa el archivo `TECHNICAL_DECISIONS.md` explicando tus elecciones
   - Documenta tu API con Swagger
   - Incluye al menos 5 tests

5. **Pull Request**: Una vez completado, crea un PR hacia el repositorio original

---

## ⏱️ Tiempo

Tienes **48 horas** desde que recibes esta prueba. Gestiona tu tiempo según tus prioridades.

---

## ❓ Preguntas Frecuentes

**¿Puedo usar librerías adicionales?**
Sí, documenta tus elecciones en `TECHNICAL_DECISIONS.md`.

**¿Qué base de datos uso?**
La que prefieras (MySQL o MongoDB). No afecta la evaluación.

**¿Es obligatorio Docker?**
No, pero suma puntos extra.

**¿Puedo usar librerías de UI?**
Sí. Recomendamos TailwindCSS para estilos, pero también puedes usar otras librerías de componentes (Material-UI, Ant Design, etc.).

---

## 🎉 ¡Buena suerte!

Recuerda: evaluamos no solo que funcione, sino **cómo está construido**. Demuestra tu criterio técnico y mejores prácticas.

Si tienes dudas sobre los requisitos, no dudes en contactarnos.

---

# 📖 Instrucciones de Ejecución

## Prerrequisitos

- **Node.js** v18+ y `npm`
- **MongoDB** (local o en la nube)
- **Git** (para clonar el repositorio)
- **Docker** (opcional, para levantar MongoDB en contenedor)

---

## Opción 1: Con MongoDB Atlas (Cloud) ⭐ RECOMENDADO

### Instalación y Ejecución

**1. Backend (en una terminal):**
```pwsh
cd backend
copy .env.example .env
```

**2. Actualiza `.env` con tu MongoDB Atlas URI:**
```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://kevindbuser:kevin12345@cluster0.nckeodp.mongodb.net/?appName=Cluster0

# Server Configuration
PORT=8080

# JWT Configuration
JWT_SECRET=tu_secreto_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

**3. Instala dependencias y levanta el backend:**
```pwsh
npm install
npm run start
```

Backend en: `http://localhost:8080/api`
Swagger en: `http://localhost:8080/api-docs`

**4. Frontend (en otra terminal):**
```pwsh
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend en: `http://localhost:5173`

**Ventajas de MongoDB Atlas:**
- ✅ No requiere instalar MongoDB localmente
- ✅ Base de datos en la nube (acceso desde cualquier lugar)
- ✅ Backups automáticos
- ✅ Ideal para testing remoto y demos

**Nota:** Asegúrate que tu IP esté whitelistada en MongoDB Atlas.

---

## Opción 2: Con Docker (MongoDB en Contenedor)

### Instalación y Ejecución

**1. Levantar MongoDB con Docker Compose:**
```pwsh
# Desde la raíz del proyecto
docker-compose up -d
```

MongoDB estará disponible en: `mongodb://localhost:27017/gestion-proyectos`

**2. Backend (en otra terminal):**
```pwsh
cd backend
npm install
npm run start
```

Backend en: `http://localhost:8080/api`
Swagger en: `http://localhost:8080/api-docs`

**3. Frontend (en otra terminal):**
```pwsh
cd frontend
npm install
npm run dev
```

Frontend en: `http://localhost:5173`

**Parar Docker:**
```pwsh
docker-compose down
```

---

## Opción 3: Sin Docker (MongoDB Local)

### Instalación y Ejecución

**1. Asegúrate que MongoDB esté corriendo:**
```pwsh
# Verifica que MongoDB esté escuchando en puerto 27017
# En Windows, MongoDB debe estar como servicio o ejecutado manualmente
mongod
```

**2. Backend (en una terminal):**
```pwsh
cd backend
copy .env.example .env
npm install
npm run start
```

Backend en: `http://localhost:8080/api`
Swagger en: `http://localhost:8080/api-docs`

**3. Frontend (en otra terminal):**
```pwsh
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend en: `http://localhost:5173`

---

## Configuración de Variables de Entorno

### Backend (`backend/.env`)

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/gestion-proyectos

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=tu_secreto_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

### Frontend (`frontend/.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Environment
VITE_NODE_ENV=development
```

---

## Verificación de Instalación

**Backend levantado correctamente si ves:**
```
🚀 Servidor corriendo en http://localhost:3000
📚 Documentación Swagger en http://localhost:3000/api-docs
✅ MongoDB conectado exitosamente
```

**Frontend levantado correctamente si ves:**
```
VITE v[version] ready in [time] ms

➜  Local:   http://localhost:5173/
```

---

## Uso de la Aplicación

### 1. Registrarse
- Ve a `http://localhost:5173/register`
- Completa el formulario con email, username y contraseña
- Se guardará en MongoDB y obtendrá un token JWT

### 2. Iniciar Sesión
- Ve a `http://localhost:5173/login`
- Ingresa tus credenciales
- Se almacenará el token y accederás al dashboard

### 3. Crear Proyecto
- Click en "Nuevo Proyecto"
- Ingresa nombre y descripción
- Se vinculará a tu usuario automáticamente

### 4. Gestionar Tareas
- Entra a un proyecto
- Crea tareas, asigna prioridad y estado
- Asigna tareas a colaboradores

### 5. Ver Swagger
- Ve a `http://localhost:3000/api-docs`
- Prueba endpoints interactivamente
- Incluye el token JWT en el botón "Authorize"

---

## Testing

### Backend Tests
```pwsh
cd backend
npm test
```

### Frontend Tests
```pwsh
cd frontend
npm test
```

**Nota**: Testing está documentado en `TECHNICAL_DECISIONS.md`. Actualmente hay validación manual via Swagger.

---

## API Documentation

**Swagger (Recomendado):** `http://localhost:3000/api-docs`

**OpenAPI JSON:** `http://localhost:3000/api-docs.json`

**Endpoints principales:**
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/users/me` - Perfil del usuario
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/tasks/my-tasks` - Mis tareas
- `GET /api/projects/:id/tasks/stats` - Estadísticas del proyecto

---

## Credenciales de Prueba

**Registro:** Usa cualquier email y contraseña válidos
```
Email: test@example.com
Username: testuser
Password: password123
```

El sistema genera automáticamente un JWT válido por 7 días.

---

## Troubleshooting

### MongoDB no conecta
- Verifica que MongoDB esté corriendo: `mongosh`
- Si usas Docker: `docker-compose up` y espera a "healthy"
- Verifica `MONGO_URI` en `.env`

### Puerto 3000 en uso
- Cambia `PORT` en `backend/.env` a otro puerto (ej: 3000)
- Actualiza `VITE_API_URL` en `frontend/.env`

### Frontend no encuentra API
- Verifica que `VITE_API_URL=http://localhost:3000/api` en `.env`
- Reinicia frontend: `npm run dev`

### Error de CORS
- Backend tiene CORS habilitado
- Verifica que frontend apunte a URL correcta

---

## Stack Implementado

- **Backend:** Node.js + Express.js + TypeScript + MongoDB + Mongoose + JWT
- **Frontend:** React 18 + TypeScript + TailwindCSS + Zustand + React Router
- **DevOps:** Docker + Docker Compose
- **Documentation:** Swagger/OpenAPI

---

## Decisiones Técnicas

Ver `TECHNICAL_DECISIONS.md` para detalles sobre:
- Por qué MongoDB vs MySQL
- Arquitectura del proyecto
- Seguridad implementada
- Optimizaciones
- Trade-offs realizados

````
