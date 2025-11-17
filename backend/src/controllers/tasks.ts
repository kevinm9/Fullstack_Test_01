import express from 'express';
import {
    createTask,
    getTasksByProject,
    getTasksByUser,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    updateTaskStatus,
    updateTaskPriority,
    assignTask,
    getTaskStatsByProject,
    TaskStatus,
    TaskPriority
} from '../db/tasks';
import { getProjectById } from '../db/projects';

/**
 * GET /projects/:projectId/tasks
 * Obtiene todas las tareas de un proyecto
 */
export const getProjectTasks = async (req: express.Request, res: express.Response) => {
    try {
        const { projectId } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar que el proyecto exista y el usuario tenga acceso
        const project = await getProjectById(projectId);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // @ts-ignore
        if (!project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a este proyecto'
            });
            return;
        }

        const tasks = await getTasksByProject(projectId);

        res.status(200).json({
            success: true,
            message: 'Tareas obtenidas exitosamente',
            data: tasks,
            total: tasks.length
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tareas',
            error: err.message
        });
    }
};

/**
 * GET /tasks/my-tasks
 * Obtiene las tareas asignadas al usuario autenticado
 */
export const getMyTasks = async (req: express.Request, res: express.Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        const tasks = await getTasksByUser(userId);

        res.status(200).json({
            success: true,
            message: 'Tus tareas obtenidas exitosamente',
            data: tasks,
            total: tasks.length
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tus tareas',
            error: err.message
        });
    }
};

/**
 * GET /tasks/:id
 * Obtiene una tarea por ID
 */
export const getTask = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        const task = await getTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Verificar acceso al proyecto
        const project = await getProjectById(task.project.toString());

        // @ts-ignore
        if (!project || !project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a esta tarea'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Tarea obtenida exitosamente',
            data: task
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tarea',
            error: err.message
        });
    }
};

/**
 * POST /projects/:projectId/tasks
 * Crea una nueva tarea en un proyecto
 */
export const createNewTask = async (req: express.Request, res: express.Response) => {
    try {
        const { projectId } = req.params;
        const { title, description, priority, dueDate, assignedTo } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Validación
        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: 'Título y descripción son requeridos'
            });
            return;
        }

        // Verificar que el proyecto exista y el usuario tenga acceso
        const project = await getProjectById(projectId);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // @ts-ignore
        if (!project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a este proyecto'
            });
            return;
        }

        // Crear tarea
        const task = await createTask({
            title,
            description,
            project: projectId as any,
            createdBy: userId as any,
            assignedTo: assignedTo || null,
            priority: priority || TaskPriority.MEDIUM,
            status: TaskStatus.PENDING,
            dueDate: dueDate || null
        });

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: task
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al crear tarea',
            error: err.message
        });
    }
};

/**
 * PUT /tasks/:id
 * Actualiza una tarea
 */
export const updateTask = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar que la tarea exista
        const task = await getTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Verificar acceso al proyecto
        const project = await getProjectById(task.project.toString());

        // @ts-ignore
        if (!project || !project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a esta tarea'
            });
            return;
        }

        // Actualizar
        const updatedTask = await updateTaskById(id, {
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo
        });

        res.status(200).json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: updatedTask
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tarea',
            error: err.message
        });
    }
};

/**
 * DELETE /tasks/:id
 * Elimina una tarea
 */
export const deleteTask = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar que la tarea exista
        const task = await getTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Verificar que el proyecto exista
        const project = await getProjectById(task.project.toString());

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // Solo el owner del proyecto o el creador de la tarea pueden eliminarla
        // @ts-ignore
        if (!project.isOwner(userId) && task.createdBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar esta tarea'
            });
            return;
        }

        await deleteTaskById(id);

        res.status(200).json({
            success: true,
            message: 'Tarea eliminada exitosamente'
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tarea',
            error: err.message
        });
    }
};

/**
 * PATCH /tasks/:id/status
 * Actualiza el estado de una tarea
 */
export const changeTaskStatus = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Validar status
        if (!Object.values(TaskStatus).includes(status)) {
            res.status(400).json({
                success: false,
                message: `Estado inválido. Debe ser: ${Object.values(TaskStatus).join(', ')}`
            });
            return;
        }

        // Verificar que la tarea exista
        const task = await getTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Verificar acceso
        const project = await getProjectById(task.project.toString());

        // @ts-ignore
        if (!project || !project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a esta tarea'
            });
            return;
        }

        const updatedTask = await updateTaskStatus(id, status);

        res.status(200).json({
            success: true,
            message: 'Estado actualizado exitosamente',
            data: updatedTask
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado',
            error: err.message
        });
    }
};

/**
 * PATCH /tasks/:id/priority
 * Actualiza la prioridad de una tarea
 */
export const changeTaskPriority = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Validar priority
        if (!Object.values(TaskPriority).includes(priority)) {
            res.status(400).json({
                success: false,
                message: `Prioridad inválida. Debe ser: ${Object.values(TaskPriority).join(', ')}`
            });
            return;
        }

        // Verificar que la tarea exista
        const task = await getTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Verificar acceso
        const project = await getProjectById(task.project.toString());

        // @ts-ignore
        if (!project || !project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a esta tarea'
            });
            return;
        }

        const updatedTask = await updateTaskPriority(id, priority);

        res.status(200).json({
            success: true,
            message: 'Prioridad actualizada exitosamente',
            data: updatedTask
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar prioridad',
            error: err.message
        });
    }
};

/**
 * PATCH /tasks/:id/assign
 * Asigna una tarea a un usuario
 */
export const assignTaskToUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { userId: assigneeId } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        if (!assigneeId) {
            res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
            return;
        }

        // Verificar que la tarea exista
        const task = await getTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        // Verificar acceso
        const project = await getProjectById(task.project.toString());

        // @ts-ignore
        if (!project || !project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a esta tarea'
            });
            return;
        }

        const updatedTask = await assignTask(id, assigneeId);

        res.status(200).json({
            success: true,
            message: 'Tarea asignada exitosamente',
            data: updatedTask
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al asignar tarea',
            error: err.message
        });
    }
};

/**
 * GET /projects/:projectId/tasks/stats
 * Obtiene estadísticas de tareas del proyecto
 */
export const getProjectTaskStats = async (req: express.Request, res: express.Response) => {
    try {
        const { projectId } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar acceso
        const project = await getProjectById(projectId);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // @ts-ignore
        if (!project.hasAccess(userId)) {
            res.status(403).json({
                success: false,
                message: 'No tienes acceso a este proyecto'
            });
            return;
        }

        const stats = await getTaskStatsByProject(projectId);

        res.status(200).json({
            success: true,
            message: 'Estadísticas obtenidas exitosamente',
            data: stats
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: err.message
        });
    }
};
