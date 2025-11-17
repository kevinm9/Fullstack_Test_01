import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { hashPassword, comparePassword, generateToken } from '../helpers';

/**
 * Controlador de login con JWT
 * Autentica al usuario y devuelve un token JWT
 */
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email y password son requeridos'
            });
            return;
        }

        const user = await getUserByEmail(email).select('+password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            res.status(403).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
            return;
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            user: userResponse
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: err.message
        });
    }
};

/**
 * Controlador de registro con JWT
 * Crea un nuevo usuario y devuelve un token JWT
 */
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.status(400).json({
                success: false,
                message: 'Email, password y username son requeridos'
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
            return;
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El usuario ya existe con ese email'
            });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const user = await createUser({
            email,
            username,
            password: hashedPassword,
            role: 'user'
        });

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: userResponse
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: err.message
        });
    }
};