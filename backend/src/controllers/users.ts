import express from 'express';
import {
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
} from '../db/users';
import { hashPassword } from '../helpers';

/**
 * GET /users/me
 * Obtiene el perfil del usuario autenticado
 */
export const getMyProfile = async (req: express.Request, res: express.Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        const user = await getUserById(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // No devolver password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Perfil obtenido exitosamente',
            data: userResponse
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: err.message
        });
    }
};

/**
 * GET /users
 * Obtiene todos los usuarios (solo admins o para seleccionar colaboradores)
 */
export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        // Mapear para no devolver passwords
        const usersResponse = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }));

        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: usersResponse,
            total: usersResponse.length
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: err.message
        });
    }
};

/**
 * GET /users/:id
 * Obtiene un usuario específico por ID
 */
export const getUserProfile = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // No devolver password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: userResponse
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: err.message
        });
    }
};

/**
 * PUT /users/:id
 * Actualiza un usuario (solo el mismo usuario o admin)
 */
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        // @ts-ignore
        const currentUserId = req.user?.userId;
        // @ts-ignore
        const currentUserRole = req.user?.role;

        // Verificar que existe el usuario a actualizar
        const userToUpdate = await getUserById(id);

        if (!userToUpdate) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Solo el mismo usuario o un admin pueden actualizar
        if (currentUserId !== id && currentUserRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar este usuario'
            });
            return;
        }

        // Preparar datos a actualizar
        const updateData: any = {};

        if (username) {
            if (username.length < 3) {
                res.status(400).json({
                    success: false,
                    message: 'El username debe tener al menos 3 caracteres'
                });
                return;
            }
            updateData.username = username;
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({
                    success: false,
                    message: 'Formato de email inválido'
                });
                return;
            }
            updateData.email = email;
        }

        if (password) {
            if (password.length < 6) {
                res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
                return;
            }
            updateData.password = await hashPassword(password);
        }

        // Si no hay nada que actualizar
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                message: 'No hay campos para actualizar'
            });
            return;
        }

        // Actualizar usuario
        const updatedUser = await updateUserById(id, updateData);

        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: 'Error al actualizar usuario'
            });
            return;
        }

        // Respuesta sin password
        const userResponse = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            updatedAt: updatedUser.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: userResponse
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: err.message
        });
    }
};

/**
 * DELETE /users/:id
 * Elimina un usuario (solo el mismo usuario o admin)
 */
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const currentUserId = req.user?.userId;
        // @ts-ignore
        const currentUserRole = req.user?.role;

        // Verificar que existe el usuario a eliminar
        const userToDelete = await getUserById(id);

        if (!userToDelete) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Solo el mismo usuario o un admin pueden eliminar
        if (currentUserId !== id && currentUserRole !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este usuario'
            });
            return;
        }

        await deleteUserById(id);

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: err.message
        });
    }
};

/**
 * GET /users/search?q=term
 * Busca usuarios por username o email
 */
export const searchUsers = async (req: express.Request, res: express.Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda "q" es requerido'
            });
            return;
        }

        // Obtener todos los usuarios y filtrar
        const allUsers = await getUsers();

        const searchTerm = q.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );

        const usersResponse = filteredUsers.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }));

        res.status(200).json({
            success: true,
            message: 'Búsqueda completada',
            data: usersResponse,
            total: usersResponse.length
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda',
            error: err.message
        });
    }
};
