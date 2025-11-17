
# Backend - API REST

Este repositorio contiene el backend TypeScript de la aplicación de gestión de proyectos y tareas. Provee autenticación por JWT, CRUD de usuarios, proyectos y tareas, gestión de colaboradores, y documentación OpenAPI/Swagger.

**Principales características:**
- Autenticación: `POST /auth/register`, `POST /auth/login` (JWT)
- Gestión de usuarios: perfiles, búsqueda y administración
- Gestión de proyectos: CRUD, colaboradores
- Gestión de tareas: CRUD, estados, prioridad, asignación y estadísticas por proyecto
- Documentación automática: Swagger en `/api-docs`

**Stack detectado:**
- **Runtime:** Node.js (probado en v18+)
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de datos:** MongoDB (Mongoose)
- **Autenticación:** JSON Web Tokens (JWT)
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)

**Recomendación:** Documenta decisiones técnicas y trade-offs en `../TECHNICAL_DECISIONS.template.md` o crea `TECHNICAL_DECISIONS.md`.

**Índice rápido**
- **Instalación**
- **Variables de entorno**
- **Scripts**
- **Estructura del proyecto**
- **Endpoints principales**
- **Swagger / Documentación**
- **Desarrollo y notas**

**Instalación (Desarrollo)**

Requisitos previos:
- Node.js v18+ y `npm`
- MongoDB (local o en la nube)

Comandos:

```pwsh
cd backend
npm install
# Copiar ejemplo de variables de entorno (PowerShell)
copy .env.example .env
# Iniciar servidor en modo desarrollo (nodemon / ts-node)
npm run start
```

Si no estás en PowerShell usa el comando de copia apropiado para tu shell.

**Variables de entorno**

La aplicación usa `dotenv`. Variables claves (valores por defecto según el código):

- `MONGO_URI` : URI de conexión a MongoDB (por defecto `mongodb://localhost:27017/gestion-proyectos`)
- `PORT` : puerto del servidor (por defecto `3000`)
- `JWT_SECRET` : secreto para firmar JWT (debe establecerse en producción)
- `JWT_EXPIRES_IN` : expiración del token (ej: `7d`) (por defecto `7d`)
- `BCRYPT_ROUNDS` : rounds para bcrypt (por defecto `10`)

Ejemplo de `.env.example` (añádelo si quieres yo use mongo db remoto):

MONGO_URI=mongodb+srv://kevindbuser:kevin12345@cluster0.nckeodp.mongodb.net/?appName=Cluster0



```
MONGO_URI=mongodb://localhost:27017/gestion-proyectos
PORT=3000
JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

**Scripts (desde `backend/package.json`)**

- `npm run start` : arranca `nodemon` que a su vez ejecuta `ts-node ./src/index.ts`.
- `npm test` : placeholder (actualmente imprime un error en `package.json`).

Puedes cambiar o añadir scripts para `build` y `start:prod` si compilas a JavaScript.

**Estructura principal del proyecto**

- `src/index.ts` : punto de entrada, carga middlewares, Swagger y router principal.
- `src/config/config.ts` : configuración de Swagger / OpenAPI.
- `src/router/` : definiciones de rutas agrupadas (`authentication.ts`, `users.ts`, `projects.ts`, `tasks.ts`).
- `src/controllers/` : lógica de manejo de cada recurso (auth, users, projects, tasks).
- `src/db/` : esquemas Mongoose y lógica de acceso a datos.
- `src/middlewares/` : middlewares (ej. `auth.ts` con `isAuthenticated`, `isAdmin`).
- `src/helpers/` : utilidades (hashing, JWT, etc.).
- `nodemon.json` : configuración para desarrollo con `ts-node`.

**Endpoints principales (resumen)**

Autenticación
- `POST /auth/register` : registrar usuario (email, username, password).
- `POST /auth/login` : iniciar sesión y recibir JWT.

Usuarios
- `GET /users/me` : perfil del usuario autenticado.
- `GET /users` : listar usuarios (autenticado).
- `GET /users/search?q=` : buscar usuarios por nombre o email.
- `GET /users/:id` : ver perfil de un usuario.
- `PUT /users/:id` : actualizar usuario (propio o admin).
- `DELETE /users/:id` : eliminar usuario (propio o admin).

Proyectos
- `GET /projects` : listar proyectos accesibles (owner o colaborador).
- `GET /projects/search?q=` : buscar proyectos.
- `GET /projects/:id` : obtener proyecto (si tienes acceso).
- `POST /projects` : crear proyecto (usuario autenticado como owner).
- `PUT /projects/:id` : actualizar proyecto (solo owner).
- `DELETE /projects/:id` : eliminar proyecto (solo owner).
- `POST /projects/:id/collaborators` : añadir colaborador (solo owner).
- `DELETE /projects/:id/collaborators/:userId` : eliminar colaborador (solo owner).

Tareas
- `GET /tasks/my-tasks` : tareas asignadas al usuario autenticado.
- `GET /projects/:projectId/tasks` : tareas de un proyecto.
- `GET /projects/:projectId/tasks/stats` : estadísticas por proyecto (por estado y prioridad).
- `POST /projects/:projectId/tasks` : crear tarea en proyecto.
- `GET /tasks/:id` : obtener tarea específica.
- `PUT /tasks/:id` : actualizar tarea.
- `DELETE /tasks/:id` : eliminar tarea.
- `PATCH /tasks/:id/status` : actualizar estado (pendiente/en progreso/completada).
- `PATCH /tasks/:id/priority` : actualizar prioridad (baja/media/alta).
- `PATCH /tasks/:id/assign` : asignar tarea a usuario.

Autenticación en peticiones
- Incluye el JWT en el header `Authorization` como `Bearer <token>`.
- Configuración adicional define una cookie `ANGEL_AUTH` en Swagger (opcional).

**Documentación Swagger / OpenAPI**

- Interfaz interactiva: `http://localhost:3000/api-docs`
- JSON OpenAPI: `http://localhost:3000/api-docs.json`

La definición se genera desde los comentarios JSDoc en `src/router/*.ts` y `src/config/config.ts` configura `swagger-jsdoc`.

**Notas de desarrollo**

- El servidor usa `mongoose` para conectar a MongoDB. URI por defecto: `mongodb://localhost:27017/gestion-proyectos`.
- El arranque registra eventos de conexión y maneja `SIGINT` para cerrar la conexión correctamente.
- Middlewares clave: `isAuthenticated` (verifica JWT y añade `req.user`), `isAdmin`, `isOwner`.
- Hashing y tokens: utilidades en `src/helpers` (`hashPassword`, `comparePassword`, `generateToken`, `verifyToken`).

**Sugerencias para producción**
- No uses `nodemon` en producción. Compila TypeScript (`tsc`) y ejecuta el JS con `node` o con PM2.
- Asegura `JWT_SECRET` y usa conexiones TLS para la base de datos cuando sea necesario.
- Añade rate limiting, helmet, y políticas CORS estrictas.

**Contribuir**

- Abre un issue o PR con cambios claros. Mantén el estilo TypeScript y añade tests si cambias lógica crítica.

**Licencia**

La configuración de Swagger indica `MIT`; confirma el archivo `LICENSE` si lo necesitas.

---

Si quieres, puedo:
- añadir un archivo `backend/.env.example` con los valores por defecto;
- generar un `README` más corto en inglés;
- o crear scripts `build` y `start:prod` en `package.json`.

¿Qué prefieres que haga a continuación?
