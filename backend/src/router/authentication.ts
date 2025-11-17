import express from 'express'

import {register,login} from '../controllers/authentication'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Rol del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         username: "johndoe"
 *         email: "john@example.com"
 *         role: "user"
 *         createdAt: "2024-01-15T10:30:00Z"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la respuesta
 *         token:
 *           type: string
 *           description: Token JWT para autenticación (válido por 7 días)
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         success: true
 *         message: "Login exitoso"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           _id: "507f1f77bcf86cd799439011"
 *           username: "johndoe"
 *           email: "john@example.com"
 *           role: "user"
 *           createdAt: "2024-01-15T10:30:00Z"
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña (será hasheada)
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *       example:
 *         email: "john@example.com"
 *         password: "SecurePass123!"
 *         username: "johndoe"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *       example:
 *         email: "john@example.com"
 *         password: "SecurePass123!"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalle del error (opcional)
 *       example:
 *         success: false
 *         message: "Email y password son requeridos"
 */

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Endpoints para registro e inicio de sesión
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea una cuenta de usuario con email único, username y contraseña hasheada con bcrypt. Devuelve un token JWT válido por 7 días.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente con token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Input inválido, email ya existe, o validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               camposFaltantes:
 *                 value:
 *                   success: false
 *                   message: "Email, password y username son requeridos"
 *               emailInvalido:
 *                 value:
 *                   success: false
 *                   message: "Formato de email inválido"
 *               passwordCorta:
 *                 value:
 *                   success: false
 *                   message: "La contraseña debe tener al menos 6 caracteres"
 *               usuarioExiste:
 *                 value:
 *                   success: false
 *                   message: "El usuario ya existe con ese email"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     description: |
 *       Autentica al usuario verificando credenciales con bcrypt y devuelve un token JWT válido por 7 días.
 *
 *       **Uso del token:**
 *       1. Guarda el token recibido
 *       2. Incluye el token en las peticiones protegidas:
 *          `Authorization: Bearer <token>`
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email o password no proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Email y password son requeridos"
 *       403:
 *         description: Contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Contraseña incorrecta"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default (router:express.Router) =>{
    router.post('/auth/register',register);
    router.post('/auth/login',login);
}