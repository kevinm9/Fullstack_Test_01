import express from 'express';
import { verifyToken } from '../helpers';

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization
 * Agrega req.user con la información del usuario autenticado
 */
export const isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Token no proporcionado. Use: Authorization: Bearer <token>'
            });
            return;
        }

        const token = authHeader.substring(7);

        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
            return;
        }
        //@ts-ignore
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar autenticación',
            error: err.message
        });
    }
};

/**
 * Middleware para verificar que el usuario sea el dueño del recurso
 * Debe usarse DESPUÉS de isAuthenticated
 */
export const isOwner = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const { id } = req.params;
        //@ts-ignore
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            res.status(403).json({
                success: false,
                message: 'No autenticado'
            });
            return;
        }

        if (currentUserId !== id) {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para acceder a este recurso'
            });
            return;
        }

        next();

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar permisos',
            error: err.message
        });
    }
};

/**
 * Middleware para verificar que el usuario sea administrador
 * Debe usarse DESPUÉS de isAuthenticated
 */
export const isAdmin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        //@ts-ignore
        const userRole = req.user?.role;

        if (!userRole || userRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de administrador'
            });
            return;
        }

        next();

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar permisos de administrador',
            error: err.message
        });
    }
};
