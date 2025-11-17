import express from 'express';
import {
    createProject,
    getProjectsByUser,
    getProjectById,
    updateProjectById,
    deleteProjectById,
    addCollaborator,
    removeCollaborator,
    searchProjectsByName
} from '../db/projects';

/**
 * GET /projects
 * Obtiene todos los proyectos accesibles por el usuario autenticado
 */
export const getAllProjects = async (req: express.Request, res: express.Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
            return;
        }

        const projects = await getProjectsByUser(userId);

        res.status(200).json({
            success: true,
            message: 'Proyectos obtenidos exitosamente',
            data: projects,
            total: projects.length
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyectos',
            error: err.message
        });
    }
};

/**
 * GET /projects/:id
 * Obtiene un proyecto por ID
 */
export const getProject = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        const project = await getProjectById(id);

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

        res.status(200).json({
            success: true,
            message: 'Proyecto obtenido exitosamente',
            data: project
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyecto',
            error: err.message
        });
    }
};

/**
 * POST /projects
 * Crea un nuevo proyecto
 */
export const createNewProject = async (req: express.Request, res: express.Response) => {
    try {
        const { name, description, collaborators } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Validación
        if (!name || !description) {
            res.status(400).json({
                success: false,
                message: 'Nombre y descripción son requeridos'
            });
            return;
        }

        // Crear proyecto
        const project = await createProject({
            name,
            description,
            owner: userId as any,
            collaborators: collaborators || [],
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Proyecto creado exitosamente',
            data: project
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al crear proyecto',
            error: err.message
        });
    }
};

/**
 * PUT /projects/:id
 * Actualiza un proyecto (solo owner)
 */
export const updateProject = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar que el proyecto exista
        const project = await getProjectById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // Verificar que sea el owner
        // @ts-ignore
        if (!project.isOwner(userId)) {
            res.status(403).json({
                success: false,
                message: 'Solo el propietario puede actualizar el proyecto'
            });
            return;
        }

        // Actualizar
        const updatedProject = await updateProjectById(id, {
            name,
            description,
            status
        });

        res.status(200).json({
            success: true,
            message: 'Proyecto actualizado exitosamente',
            data: updatedProject
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar proyecto',
            error: err.message
        });
    }
};

/**
 * DELETE /projects/:id
 * Elimina un proyecto (solo owner)
 */
export const deleteProject = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar que el proyecto exista
        const project = await getProjectById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // Verificar que sea el owner
        // @ts-ignore
        if (!project.isOwner(userId)) {
            res.status(403).json({
                success: false,
                message: 'Solo el propietario puede eliminar el proyecto'
            });
            return;
        }

        await deleteProjectById(id);

        res.status(200).json({
            success: true,
            message: 'Proyecto eliminado exitosamente'
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar proyecto',
            error: err.message
        });
    }
};

/**
 * POST /projects/:id/collaborators
 * Añade un colaborador al proyecto (solo owner)
 */
export const addProjectCollaborator = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { userId: collaboratorId } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        if (!collaboratorId) {
            res.status(400).json({
                success: false,
                message: 'userId del colaborador es requerido'
            });
            return;
        }

        // Verificar que el proyecto exista
        const project = await getProjectById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // Verificar que sea el owner
        // @ts-ignore
        if (!project.isOwner(userId)) {
            res.status(403).json({
                success: false,
                message: 'Solo el propietario puede añadir colaboradores'
            });
            return;
        }

        // Añadir colaborador
        const updatedProject = await addCollaborator(id, collaboratorId);

        res.status(200).json({
            success: true,
            message: 'Colaborador añadido exitosamente',
            data: updatedProject
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al añadir colaborador',
            error: err.message
        });
    }
};

/**
 * DELETE /projects/:id/collaborators/:userId
 * Elimina un colaborador del proyecto (solo owner)
 */
export const removeProjectCollaborator = async (req: express.Request, res: express.Response) => {
    try {
        const { id, userId: collaboratorId } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verificar que el proyecto exista
        const project = await getProjectById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
            return;
        }

        // Verificar que sea el owner
        // @ts-ignore
        if (!project.isOwner(userId)) {
            res.status(403).json({
                success: false,
                message: 'Solo el propietario puede eliminar colaboradores'
            });
            return;
        }

        // Eliminar colaborador
        const updatedProject = await removeCollaborator(id, collaboratorId);

        res.status(200).json({
            success: true,
            message: 'Colaborador eliminado exitosamente',
            data: updatedProject
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar colaborador',
            error: err.message
        });
    }
};

/**
 * GET /projects/search?q=term
 * Busca proyectos por nombre
 */
export const searchProjects = async (req: express.Request, res: express.Response) => {
    try {
        const { q } = req.query;
        // @ts-ignore
        const userId = req.user?.userId;

        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda "q" es requerido'
            });
            return;
        }

        const projects = await searchProjectsByName(q, userId);

        res.status(200).json({
            success: true,
            message: 'Búsqueda completada',
            data: projects,
            total: projects.length
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda',
            error: err.message
        });
    }
};
