import express from 'express';
import {
    getProjectTasks,
    getMyTasks,
    getTask,
    createNewTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    changeTaskPriority,
    assignTaskToUser,
    getProjectTaskStats
} from '../controllers/tasks';
import { isAuthenticated } from '../middlewares/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la tarea
 *         title:
 *           type: string
 *           description: Título de la tarea
 *         description:
 *           type: string
 *           description: Descripción detallada
 *         project:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         assignedTo:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         status:
 *           type: string
 *           enum: [pendiente, en progreso, completada]
 *           description: Estado de la tarea
 *         priority:
 *           type: string
 *           enum: [baja, media, alta]
 *           description: Prioridad de la tarea
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha límite
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "507f1f77bcf86cd799439015"
 *         title: "Implementar autenticación"
 *         description: "Desarrollar sistema de login con JWT"
 *         project:
 *           _id: "507f1f77bcf86cd799439011"
 *           name: "Proyecto Web"
 *         createdBy:
 *           _id: "507f1f77bcf86cd799439012"
 *           username: "johndoe"
 *           email: "john@example.com"
 *         assignedTo:
 *           _id: "507f1f77bcf86cd799439013"
 *           username: "janedoe"
 *           email: "jane@example.com"
 *         status: "en progreso"
 *         priority: "alta"
 *         dueDate: "2024-02-01T00:00:00Z"
 *         createdAt: "2024-01-15T10:30:00Z"
 *         updatedAt: "2024-01-16T14:20:00Z"
 *
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la tarea
 *         description:
 *           type: string
 *           description: Descripción de la tarea
 *         priority:
 *           type: string
 *           enum: [baja, media, alta]
 *           description: Prioridad (opcional, por defecto 'media')
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Fecha límite (opcional)
 *         assignedTo:
 *           type: string
 *           description: ID del usuario asignado (opcional)
 *       example:
 *         title: "Implementar autenticación"
 *         description: "Desarrollar sistema de login con JWT"
 *         priority: "alta"
 *         dueDate: "2024-02-01T00:00:00Z"
 *         assignedTo: "507f1f77bcf86cd799439013"
 *
 *     UpdateTaskRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Nuevo título (opcional)
 *         description:
 *           type: string
 *           description: Nueva descripción (opcional)
 *         status:
 *           type: string
 *           enum: [pendiente, en progreso, completada]
 *           description: Nuevo estado (opcional)
 *         priority:
 *           type: string
 *           enum: [baja, media, alta]
 *           description: Nueva prioridad (opcional)
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Nueva fecha límite (opcional)
 *         assignedTo:
 *           type: string
 *           description: Nuevo usuario asignado (opcional)
 *       example:
 *         title: "Implementar autenticación JWT"
 *         status: "completada"
 *         priority: "media"
 *
 *     ChangeStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pendiente, en progreso, completada]
 *           description: Nuevo estado de la tarea
 *       example:
 *         status: "completada"
 *
 *     ChangePriorityRequest:
 *       type: object
 *       required:
 *         - priority
 *       properties:
 *         priority:
 *           type: string
 *           enum: [baja, media, alta]
 *           description: Nueva prioridad de la tarea
 *       example:
 *         priority: "alta"
 *
 *     AssignTaskRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario a asignar
 *       example:
 *         userId: "507f1f77bcf86cd799439013"
 *
 *     TaskStats:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total de tareas
 *         pending:
 *           type: number
 *           description: Tareas pendientes
 *         inProgress:
 *           type: number
 *           description: Tareas en progreso
 *         completed:
 *           type: number
 *           description: Tareas completadas
 *         byPriority:
 *           type: object
 *           properties:
 *             baja:
 *               type: number
 *             media:
 *               type: number
 *             alta:
 *               type: number
 *       example:
 *         total: 15
 *         pending: 5
 *         inProgress: 7
 *         completed: 3
 *         byPriority:
 *           baja: 4
 *           media: 8
 *           alta: 3
 */

/**
 * @swagger
 * tags:
 *   - name: Tareas
 *     description: Gestión de tareas en proyectos
 */

/**
 * @swagger
 * /tasks/my-tasks:
 *   get:
 *     summary: Obtiene las tareas asignadas al usuario autenticado
 *     description: Lista todas las tareas donde el usuario está asignado
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tareas obtenidas exitosamente
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
 *                   example: "Tus tareas obtenidas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 total:
 *                   type: number
 *                   example: 8
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Obtiene todas las tareas de un proyecto
 *     description: Lista las tareas del proyecto (requiere acceso al proyecto)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Tareas obtenidas exitosamente
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
 *                   example: "Tareas obtenidas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 total:
 *                   type: number
 *                   example: 15
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
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Crea una nueva tarea en un proyecto
 *     description: Añade una tarea al proyecto (requiere acceso al proyecto)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
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
 *                   example: "Tarea creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Título y descripción son requeridos"
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
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{projectId}/tasks/stats:
 *   get:
 *     summary: Obtiene estadísticas de tareas del proyecto
 *     description: Devuelve contadores de tareas por estado y prioridad
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
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
 *                   example: "Estadísticas obtenidas exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/TaskStats'
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
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea específica
 *     description: Devuelve los detalles de una tarea (requiere acceso al proyecto)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *         example: "507f1f77bcf86cd799439015"
 *     responses:
 *       200:
 *         description: Tarea obtenida exitosamente
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
 *                   example: "Tarea obtenida exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin acceso a la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Actualiza una tarea
 *     description: Modifica los campos de una tarea (requiere acceso al proyecto)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *         example: "507f1f77bcf86cd799439015"
 *     requestBody:
 *       description: Campos a actualizar (todos opcionales)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
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
 *                   example: "Tarea actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin acceso a la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Elimina una tarea
 *     description: |
 *       Elimina permanentemente una tarea.
 *
 *       **Permisos:** Solo el owner del proyecto o el creador de la tarea.
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *         example: "507f1f77bcf86cd799439015"
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
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
 *                   example: "Tarea eliminada exitosamente"
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
 *               message: "No tienes permiso para eliminar esta tarea"
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Actualiza el estado de una tarea
 *     description: Cambia el estado (pendiente/en progreso/completada)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *         example: "507f1f77bcf86cd799439015"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeStatusRequest'
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
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
 *                   example: "Estado actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Estado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Estado inválido. Debe ser: pendiente, en progreso, completada"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin acceso a la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /tasks/{id}/priority:
 *   patch:
 *     summary: Actualiza la prioridad de una tarea
 *     description: Cambia la prioridad (baja/media/alta)
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *         example: "507f1f77bcf86cd799439015"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePriorityRequest'
 *     responses:
 *       200:
 *         description: Prioridad actualizada exitosamente
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
 *                   example: "Prioridad actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Prioridad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Prioridad inválida. Debe ser: baja, media, alta"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin acceso a la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /tasks/{id}/assign:
 *   patch:
 *     summary: Asigna una tarea a un usuario
 *     description: Establece o cambia el usuario asignado a la tarea
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *         example: "507f1f77bcf86cd799439015"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignTaskRequest'
 *     responses:
 *       200:
 *         description: Tarea asignada exitosamente
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
 *                   example: "Tarea asignada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: userId faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "userId es requerido"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin acceso a la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default (router: express.Router) => {
    // Rutas de tareas del usuario
    router.get('/tasks/my-tasks', isAuthenticated, getMyTasks);

    // Rutas de tareas por proyecto
    router.get('/projects/:projectId/tasks', isAuthenticated, getProjectTasks);
    router.get('/projects/:projectId/tasks/stats', isAuthenticated, getProjectTaskStats);
    router.post('/projects/:projectId/tasks', isAuthenticated, createNewTask);

    // Rutas de tareas individuales
    router.get('/tasks/:id', isAuthenticated, getTask);
    router.put('/tasks/:id', isAuthenticated, updateTask);
    router.delete('/tasks/:id', isAuthenticated, deleteTask);

    // Actualizar estado y prioridad
    router.patch('/tasks/:id/status', isAuthenticated, changeTaskStatus);
    router.patch('/tasks/:id/priority', isAuthenticated, changeTaskPriority);
    router.patch('/tasks/:id/assign', isAuthenticated, assignTaskToUser);
};
