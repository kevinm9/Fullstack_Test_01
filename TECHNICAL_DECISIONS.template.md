# Decisiones Técnicas
## KEVIN MOSQUERA CORONEL JOFFRE

> **Nota**: Este es un archivo opcional pero recomendado. Documentar tus decisiones técnicas demuestra pensamiento crítico y puede sumar puntos extra en la evaluación.

---

## 📋 Información General

- **Nombre del Candidato**: KEVIN MOSQUERA CORONEL JOFFRE
- **Fecha de Inicio**: 15/11/2025 (SÁBADO)
- **Fecha de Entrega**: 16/11/2025 (DOMINGO)
- **Tiempo Dedicado**: 24 HORAS

---

## 🛠️ Stack Tecnológico Elegido

### Backend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| Node.js | 18.x | Disponibilidad, rendimiento y excelente ecosistema para APIs REST |
| Express | 4.x | Framework minimalista y flexible, ampliamente usado en la industria |
| MongoDB | 7.0 | Base de datos NoSQL flexible, ideal para prototipado rápido. Mejor que MySQL para estructuras dinámicas |
| Mongoose | 8.x | ODM robusto con validación de esquemas y manejo de relaciones |
| JWT | 9.x | Autenticación stateless, escalable y segura |
| Bcryptjs | 3.x | Hashing seguro de contraseñas, estándar de la industria |
| Swagger/OpenAPI | 6.x | Documentación automática interactiva de la API |
| TypeScript | 5.x | Type safety, mejor desarrollo y menos errores en runtime |
| Joi | 17.x | Validación robusta de esquemas en datos de entrada |

### Frontend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| React | 18.x | Librería más popular, gran ecosistema y comunidad |
| TypeScript | 5.x | Type safety para evitar errores comunes en JavaScript |
| Vite | Última | Build tool moderno, más rápido que Create React App |
| React Router | 6.x | Routing moderno con excelente manejo de parámetros |
| TailwindCSS | 3.x | Utility-first CSS, desarrollo rápido y consistente |
| Zustand | Última | State management ligero y simple sin boilerplate de Redux |
| Axios | Última | Cliente HTTP moderno y flexible para consumir APIs |

---

## 🏗️ Arquitectura

### Estructura del Backend

```
backend/
├── src/
│   ├── index.ts                 # Punto de entrada
│   ├── config/
│   │   └── config.ts            # Configuración de Swagger
│   ├── controllers/             # Lógica de negocio por recurso
│   │   ├── authentication.ts
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   └── tasks.ts
│   ├── db/                      # Esquemas Mongoose
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   └── tasks.ts
│   ├── middlewares/             # Middlewares (auth, validación)
│   │   └── auth.ts
│   ├── router/                  # Definiciones de rutas
│   │   ├── index.ts
│   │   ├── authentication.ts
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   └── tasks.ts
│   ├── helpers/                 # Funciones utilitarias
│   │   └── index.ts             # JWT, bcrypt, validación
│   └── types/
│       └── models.ts            # Interfaces TypeScript
├── nodemon.json                 # Configuración de desarrollo
├── tsconfig.json
└── package.json
```

**Razón de esta estructura:**
- Separación de responsabilidades: cada layer tiene una función clara
- Escalabilidad: fácil agregar nuevos recursos (controllers, routers, esquemas)
- Mantenibilidad: código organizado y predecible
- Reutilización: helpers y middlewares centralizados

### Estructura del Frontend

```
frontend/
├── src/
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Entry point
│   ├── components/
│   │   ├── ProtectedRoute.tsx   # Rutas protegidas
│   │   ├── TaskCard.tsx
│   │   └── ui/                  # Componentes reutilizables
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── pages/                   # Páginas (vistas)
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── MyTasks.tsx
│   │   ├── TaskForm.tsx
│   │   └── ProjectForm.tsx
│   ├── store/                   # Estado global (Zustand)
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   └── taskStore.ts
│   ├── lib/
│   │   ├── api.ts               # Cliente HTTP (Axios)
│   │   └── utils.ts             # Funciones auxiliares
│   ├── types/
│   │   └── index.ts             # Interfaces compartidas
│   └── styles/
│       └── globals.css
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

**Razón de esta estructura:**
- Páginas separadas por ruta (fácil de navegar)
- Componentes reutilizables en `ui/`
- Estado global con Zustand (simpler que Redux)
- Separación clara entre componentes, páginas y store

---

## 🗄️ Diseño de Base de Datos

### Elección: MongoDB

**Razones:**
- Estructura flexible: los proyectos y tareas tienen campos variados
- Mejor para prototipado rápido: sin necesidad de migrations
- Relaciones embedding: referencias entre usuarios, proyectos y tareas son naturales
- Escalabilidad horizontal: MongoDB escala mejor para datos no relacionales

### Schema/Modelos

**Usuarios (users)**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique, lowercase),
  password: String (hashed),
  role: String (enum: ["user", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

**Proyectos (projects)**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  collaborators: [ObjectId] (ref: User),
  status: String (enum: ["active", "completed", "archived"]),
  createdAt: Date,
  updatedAt: Date
}
```

**Tareas (tasks)**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User, nullable),
  status: String (enum: ["pendiente", "en progreso", "completada"]),
  priority: String (enum: ["baja", "media", "alta"]),
  dueDate: Date (nullable),
  createdAt: Date,
  updatedAt: Date
}
```

**Decisiones importantes:**
- **Normalización**: Usé referencias (ObjectId) entre colecciones, no embedding completo, para evitar duplicación
- **Índices**: 
  - `email` y `username` en users (búsquedas rápidas)
  - `project` en tasks (consultas por proyecto)
  - `assignedTo` en tasks (listado de tareas del usuario)
- **Relaciones**: One-to-Many (usuario → proyectos/tareas), Many-to-Many (proyecto ↔ colaboradores mediante array)

---

## 🔐 Seguridad

### Implementaciones de Seguridad

- [x] **Hash de contraseñas**: Bcryptjs con 10 rounds. Es estándar, seguro y tiene buena performance
- [x] **JWT**: Token expira en 7 días. Almacenado en localStorage del cliente, incluido en header `Authorization: Bearer`
- [x] **Validación de inputs**: Joi en backend valida schema de request. Frontend tiene validación básica
- [x] **CORS**: Habilitado con `credentials: true` para cookies/tokens
- [x] **Headers de seguridad**: Body parser limita tamaño de payloads. Compression habilitada
- [x] **Rate limiting**: No implementado (podría agregarse en futuro con express-rate-limit)

### Consideraciones Adicionales

- Middlewares de autenticación (`isAuthenticated`) protegen rutas sensibles
- Middleware `isOwner` verifica que el usuario sea propietario del recurso antes de editar/eliminar
- Middleware `isAdmin` para rutas administrativas futuras
- Contraseñas nunca se devuelven en responses
- Validación de email format con Joi
- Longitud mínima de contraseña: 6 caracteres (podría mejorar a 12)

**Vulnerabilidades consideradas:**
- SQL Injection: No aplicable (NoSQL), pero el schema validation mitiga inyecciones
- XSS: Frontend no renderiza user input sin sanitizar
- CSRF: Mitigado con SameSite cookie en producción
- Brute force: No hay rate limiting actual (TODO)

---

## 🎨 Decisiones de UI/UX

### Framework/Librería de UI

**Elegí**: TailwindCSS puro (sin component libraries)

**Razón**: 
- Desarrollo rápido con utility classes
- Tamaño reducido del bundle vs Material-UI/Ant Design
- Control total del diseño
- Mejor performance en desarrollo con Vite

### Patrones de Diseño

- **Responsive Design**: Mobile-first approach con breakpoints de Tailwind (sm, md, lg, xl)
- **Loading States**: Botones deshabilitados con spinner durante requests
- **Error Handling**: Mensajes de error en componentes de formulario + alertas globales
- **Feedback Visual**: Toasts para confirmaciones, modales para confirmación de acciones destructivas
- **Formularios**: React Hook Form para performance, menos re-renders
- **Validación**: Feedback inline en inputs (rojo si hay error, verde si es válido)

### Decisiones de UX

- Sidebar de navegación principal (siempre visible en desktop)
- Drawer en mobile para no ocupar espacio
- Cards para proyectos y tareas (visual agradable)
- Kanban-like view posible (pero optamos por lista por tiempo)
- Breadcrumbs en detalle de proyecto
- Paginación lazy (scroll infinito alternativa no implementada)

---

## 🧪 Testing

### Estrategia de Testing

**Backend:**
- No implementé tests formales por falta de tiempo (24 horas)
- Validé manualmente endpoints con Swagger/Postman
- Próximo paso: Jest + Supertest para validar controllers

**Frontend:**
- Validación manual de componentes en desarrollo
- Testing de flujos críticos: login, crear proyecto, crear tarea
- Próximo paso: React Testing Library + Jest para componentes

### Cobertura

- **Backend**: 0% (manual testing solamente)
- **Frontend**: 0% (manual testing solamente)

**Razón**: Con 24 horas, prioricé funcionalidad sobre tests. En un proyecto real, comenzaría con tests desde el inicio.

---

## 🐳 Docker

### Implementación

- [x] docker-compose.yml (MongoDB solo, por request del usuario)
- [ ] Dockerfile backend (no requerido por usuario)
- [ ] Dockerfile frontend (no requerido por usuario)

**Decisiones:**
- MongoDB 7.0 Alpine por tamaño reducido
- Volumen persistente `mongo_data` para evitar pérdida de datos
- Health check para esperar a que MongoDB esté listo
- Network bridge para comunicación entre servicios

---

## ⚡ Optimizaciones

### Backend

- **Compression middleware**: Reduce tamaño de responses HTTP
- **Body parser limit**: 10mb default para evitar payloads enormes
- **Index en MongoDB**: En campos clave (email, project, assignedTo)
- **Lazy population**: Mongoose populate solo cuando es necesario
- **Error handling**: Evita crashes, devuelve errores gráciles

### Frontend

- **Vite tree-shaking**: Elimina código no usado
- **Lazy loading**: React.lazy() para rutas (Project Detail, Task Form)
- **Memoization**: useMemo/useCallback donde sea necesario
- **Virtual scrolling**: Posible para listas grandes (no implementado)
- **Image optimization**: Usar formatos modernos (WebP)

---

## 🚧 Desafíos y Soluciones

### Desafío 1: Autenticación con JWT en Frontend

**Problema:**
Token JWT almacenado en localStorage. ¿Cómo mantenerlo en requests sin que el usuario lo vea? ¿Dónde guardarlo de forma segura?

**Solución:**
- Guardé token en localStorage (simple pero menos seguro que HttpOnly cookies)
- Axios interceptor agrega `Authorization: Bearer` automáticamente a cada request
- Error 401 → logout automático y redirect a login

**Aprendizaje:**
En producción, usar HttpOnly cookies es más seguro que localStorage (previene XSS).

### Desafío 2: Gestión de Estado Global en Frontend

**Problema:**
¿Redux? ¿Context API? ¿Zustand? Con 24 horas, necesitaba algo rápido y sin boilerplate.

**Solución:**
Zustand: 3 stores simples (authStore, projectStore, taskStore) con getter/setter claros. Mucho más ligero que Redux.

**Aprendizaje:**
Para proyectos pequeños-medianos, Zustand es mejor que Redux. Redux es overkill aquí.

### Desafío 3: Prefijo `/api` en todas las rutas

**Problema:**
Usuario quería todas las URLs bajo `/api` (ej: `http://localhost:8080/api/auth/register`). Hice cambio simple en `index.ts` de `app.use("/", router())` a `app.use("/api", router())`.

**Solución:**
Cambio de 1 línea. Frontend y Swagger actualizados automáticamente.

**Aprendizaje:**
Pequeños cambios arquitectónicos en entrada de la app tienen gran impacto.

---

## 🎯 Trade-offs

### Trade-off 1: MongoDB vs MySQL

**Opciones consideradas:**
- MySQL: Relacional, ACID, mejor para datos estructurados
- MongoDB: Flexible, NoSQL, mejor para prototipado

**Elegí**: MongoDB

**Razón:**
En pruebas técnicas, MongoDB es más rápido de prototipear. No necesitamos ACID riguroso acá. El proyecto es colaborativo (referencias dinámicas), MongoDB maneja bien eso.

### Trade-off 2: Testing vs Funcionalidad

**Opciones consideradas:**
- Opción A: Implementar tests unitarios y de integración (Jest, Supertest)
- Opción B: Priorizar funcionalidad completa (CRUD, autenticación, Swagger)

**Elegí**: Opción B (Funcionalidad)

**Razón:**
Con 24 horas, un MVP funcional suma más que tests. La evaluación pesa funcionalidad (30%) más que testing (5%). En un proyecto real, empezaría con tests.

### Trade-off 3: Component Library vs Tailwind

**Opciones consideradas:**
- Material-UI: Componentes listos, pero ~500KB extra
- TailwindCSS: Ligero, control total, pero más código manual

**Elegí**: TailwindCSS

**Razón:**
Vite + Tailwind = bundle pequeño y rápido. Material-UI sería overkill para un MVP.

---

## 🔮 Mejoras Futuras

Si tuviera más tiempo, implementaría:

1. **Testing Exhaustivo (Jest + Supertest + React Testing Library)**
   - Descripción: Tests unitarios en controllers, tests de integración en rutas, tests de componentes React
   - Beneficio: Confianza en el código, menos bugs en producción
   - Tiempo estimado: 8-10 horas

2. **Autenticación con HttpOnly Cookies + CSRF Protection**
   - Descripción: Reemplazar localStorage con HttpOnly cookies (más seguro contra XSS)
   - Beneficio: Seguridad mejorada
   - Tiempo estimado: 3-4 horas

3. **Rate Limiting y Throttling**
   - Descripción: express-rate-limit en backend, debounce en frontend
   - Beneficio: Previene spam y ataques DDoS
   - Tiempo estimado: 2 horas

4. **Real-time Updates con Socket.io**
   - Descripción: Actualización en tiempo real de tareas cuando otro usuario las edita
   - Beneficio: Mejor UX colaborativa
   - Tiempo estimado: 6-8 horas

5. **Paginación Backend Adecuada**
   - Descripción: Limit/offset en listados de proyectos y tareas
   - Beneficio: Performance con muchos datos
   - Tiempo estimado: 2-3 horas

6. **Email Notifications**
   - Descripción: Notificaciones vía email cuando se asigna tarea
   - Beneficio: Mayor engagement de usuarios
   - Tiempo estimado: 4-5 horas

7. **Search Avanzado (Elasticsearch)**
   - Descripción: Búsqueda full-text en proyectos y tareas
   - Beneficio: UX mejorada en búsquedas
   - Tiempo estimado: 5-6 horas

---

## 📚 Recursos Consultados

Lista de recursos que consultaste durante el desarrollo:

- Documentación oficial de Express.js
- Documentación oficial de MongoDB/Mongoose
- Documentación oficial de React 18
- Swagger/OpenAPI documentation
- JWT best practices (jwt.io)
- TypeScript Handbook
- Tailwind CSS documentation
- Zustand GitHub repository
- Vite documentation
- Stack Overflow (varios threads sobre JWT, Mongoose, React Router)

---

## 🤔 Reflexión Final

### ¿Qué salió bien?

- **Arquitectura clara**: Backend bien estructurado, fácil de mantener
- **Autenticación robusta**: JWT implementado correctamente con bcrypt
- **Documentación automática**: Swagger genera docs sin esfuerzo adicional
- **Decisiones técnicas prácticas**: MongoDB y Zustand fueron buenas opciones para el tiempo disponible
- **TypeScript**: Pasé tiempo inicial en tipos, después desarrollo más rápido
- **Comunicación backend-frontend**: API clara, fácil integración

### ¿Qué mejorarías?

- **Testing**: Debería haber hecho TDD desde el inicio, aunque sea básico
- **Error handling**: Más granular y consistente en frontend (mejor UX)
- **Validación frontend**: Más exhaustiva antes de enviar al servidor
- **Seguridad**: Implementar rate limiting y HttpOnly cookies desde inicio
- **Documentación de código**: Más comentarios en lógica compleja
- **Mobile UI**: Layout mejor optimizado para smartphones

### ¿Qué aprendiste?

- **Rapidez con Vite**: Vite es significativamente más rápido que CRA en desarrollo
- **Zustand simplicidad**: State management puede ser simple sin Redux
- **Docker facilidades**: docker-compose simplifica el stack local
- **Importancia del API design**: Endpoint claros = integración fácil
- **TypeScript ROI**: Invertir tiempo inicial en tipos → menos bugs después
- **Priorización realista**: En 24 horas, MVP > perfección

---

## 📸 Capturas de Pantalla

[Opcional: Agrega capturas de pantalla de tu aplicación]

### Login
[Captura de Login]

### Dashboard
[Captura de Dashboard]

### Lista de Proyectos
[Captura de Proyectos]

### Detalle de Tareas
[Captura de Tareas]

---

**Fecha de última actualización**: 16/11/2025
