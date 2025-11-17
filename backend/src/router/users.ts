import express from 'express';
import {
    getAllUsers,
    getUserProfile,
    getMyProfile,
    updateUser,
    deleteUser,
    searchUsers
} from '../controllers/users';
import { isAuthenticated, isAdmin } from '../middlewares/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           description: Nuevo nombre de usuario (opcional)
 *         email:
 *           type: string
 *           format: email
 *           description: Nuevo email (opcional)
 *         password:
 *           type: string
 *           minLength: 6
 *           format: password
 *           description: Nueva contraseña (opcional)
 *       example:
 *         username: "nuevonombre"
 *         email: "nuevo@email.com"
 */

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gestión de usuarios y perfiles
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     description: Devuelve la información del usuario que está autenticado actualmente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
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
 *                   example: "Perfil obtenido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado o token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Busca usuarios por nombre o email
 *     description: Permite buscar usuarios por username o email (útil para añadir colaboradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o email)
 *         example: "john"
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
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: number
 *                   example: 3
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
 * /users:
 *   get:
 *     summary: Lista todos los usuarios
 *     description: Obtiene la lista completa de usuarios (útil para seleccionar colaboradores en proyectos)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios obtenidos exitosamente
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
 *                   example: "Usuarios obtenidos exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: number
 *                   example: 10
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por ID
 *     description: Devuelve la información pública de un usuario específico
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
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
 *                   example: "Usuario obtenido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Actualiza un usuario
 *     description: |
 *       Actualiza la información de un usuario (username, email o password).
 *
 *       **Permisos:** Solo el mismo usuario o un administrador pueden actualizar.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       description: Campos a actualizar (todos opcionales)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                   example: "Usuario actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               sinCambios:
 *                 value:
 *                   success: false
 *                   message: "No hay campos para actualizar"
 *               usernameCorto:
 *                 value:
 *                   success: false
 *                   message: "El username debe tener al menos 3 caracteres"
 *               emailInvalido:
 *                 value:
 *                   success: false
 *                   message: "Formato de email inválido"
 *               passwordCorta:
 *                 value:
 *                   success: false
 *                   message: "La contraseña debe tener al menos 6 caracteres"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos para actualizar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "No tienes permiso para actualizar este usuario"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Elimina un usuario
 *     description: |
 *       Elimina permanentemente un usuario del sistema.
 *
 *       **Permisos:** Solo el mismo usuario o un administrador pueden eliminar.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
 *                   example: "Usuario eliminado exitosamente"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos para eliminar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "No tienes permiso para eliminar este usuario"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default (router: express.Router) => {
    // Perfil del usuario autenticado
    router.get('/users/me', isAuthenticated, getMyProfile);

    // Búsqueda de usuarios
    router.get('/users/search', isAuthenticated, searchUsers);

    // Listar todos los usuarios (útil para seleccionar colaboradores)
    router.get('/users', isAuthenticated, getAllUsers);

    // Ver perfil de usuario específico
    router.get('/users/:id', isAuthenticated, getUserProfile);

    // Actualizar usuario (el mismo usuario o admin)
    router.put('/users/:id', isAuthenticated, updateUser);

    // Eliminar usuario (el mismo usuario o admin)
    router.delete('/users/:id', isAuthenticated, deleteUser);
};
