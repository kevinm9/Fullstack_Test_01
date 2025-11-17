import express from 'express';
import {
    getAllProjects,
    getProject,
    createNewProject,
    updateProject,
    deleteProject,
    addProjectCollaborator,
    removeProjectCollaborator,
    searchProjects
} from '../controllers/projects';
import { isAuthenticated } from '../middlewares/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del proyecto
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción del proyecto
 *         owner:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         collaborators:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *         status:
 *           type: string
 *           enum: [active, completed, archived]
 *           description: Estado del proyecto
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "Proyecto Web"
 *         description: "Desarrollo de sitio web corporativo"
 *         owner:
 *           _id: "507f1f77bcf86cd799439012"
 *           username: "johndoe"
 *           email: "john@example.com"
 *         collaborators:
 *           - _id: "507f1f77bcf86cd799439013"
 *             username: "janedoe"
 *             email: "jane@example.com"
 *         status: "active"
 *         createdAt: "2024-01-15T10:30:00Z"
 *         updatedAt: "2024-01-15T10:30:00Z"
 *
 *     CreateProjectRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción del proyecto
 *         collaborators:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de usuarios colaboradores (opcional)
 *       example:
 *         name: "Proyecto Web"
 *         description: "Desarrollo de sitio web corporativo"
 *         collaborators: ["507f1f77bcf86cd799439013"]
 *
 *     UpdateProjectRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nuevo nombre del proyecto (opcional)
 *         description:
 *           type: string
 *           description: Nueva descripción (opcional)
 *         status:
 *           type: string
 *           enum: [active, completed, archived]
 *           description: Nuevo estado (opcional)
 *       example:
 *         name: "Proyecto Web Actualizado"
 *         status: "completed"
 *
 *     AddCollaboratorRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario a añadir como colaborador
 *       example:
 *         userId: "507f1f77bcf86cd799439013"
 */

/**
 * @swagger
 * tags:
 *   - name: Proyectos
 *     description: Gestión de proyectos colaborativos
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lista todos los proyectos accesibles
 *     description: Obtiene todos los proyectos donde el usuario es owner o colaborador
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proyectos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proyectos obtenidos exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 total:
 *                   type: number
 *                   example: 5
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/search:
 *   get:
 *     summary: Busca proyectos por nombre
 *     description: Filtra proyectos accesibles por el usuario que coincidan con el término de búsqueda
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *         example: "web"
 *     responses:
 *       200:
 *         description: Búsqueda completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Búsqueda completada"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 total:
 *                   type: number
 *                   example: 2
 *       400:
 *         description: Parámetro de búsqueda faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto específico
 *     description: Devuelve los detalles completos de un proyecto (solo si tienes acceso)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Proyecto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proyecto obtenido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin acceso al proyecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "No tienes acceso a este proyecto"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Actualiza un proyecto
 *     description: |
 *       Actualiza la información de un proyecto (nombre, descripción o estado).
 *
 *       **Permisos:** Solo el propietario puede actualizar.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a actualizar
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       description: Campos a actualizar (todos opcionales)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proyecto actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Solo el propietario puede actualizar el proyecto"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Elimina un proyecto
 *     description: |
 *       Elimina permanentemente un proyecto del sistema.
 *
 *       **Permisos:** Solo el propietario puede eliminar.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a eliminar
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proyecto eliminado exitosamente"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos para eliminar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Solo el propietario puede eliminar el proyecto"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     description: Crea un proyecto con el usuario autenticado como propietario
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proyecto creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Nombre y descripción son requeridos"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{id}/collaborators:
 *   post:
 *     summary: Añade un colaborador al proyecto
 *     description: |
 *       Añade un usuario como colaborador del proyecto.
 *
 *       **Permisos:** Solo el propietario puede añadir colaboradores.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCollaboratorRequest'
 *     responses:
 *       200:
 *         description: Colaborador añadido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Colaborador añadido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: userId faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "userId del colaborador es requerido"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos para añadir colaboradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Solo el propietario puede añadir colaboradores"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{id}/collaborators/{userId}:
 *   delete:
 *     summary: Elimina un colaborador del proyecto
 *     description: |
 *       Remueve un usuario de los colaboradores del proyecto.
 *
 *       **Permisos:** Solo el propietario puede eliminar colaboradores.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario colaborador a eliminar
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Colaborador eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Colaborador eliminado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos para eliminar colaboradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Solo el propietario puede eliminar colaboradores"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default (router: express.Router) => {
    // Todas las rutas requieren autenticación
    router.get('/projects', isAuthenticated, getAllProjects);
    router.get('/projects/search', isAuthenticated, searchProjects);
    router.get('/projects/:id', isAuthenticated, getProject);
    router.post('/projects', isAuthenticated, createNewProject);
    router.put('/projects/:id', isAuthenticated, updateProject);
    router.delete('/projects/:id', isAuthenticated, deleteProject);

    // Gestión de colaboradores
    router.post('/projects/:id/collaborators', isAuthenticated, addProjectCollaborator);
    router.delete('/projects/:id/collaborators/:userId', isAuthenticated, removeProjectCollaborator);
};
