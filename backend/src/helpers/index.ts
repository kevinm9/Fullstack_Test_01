import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');

// Función legacy (mantener por compatibilidad si es necesario)
export const random = () => crypto.randomBytes(128).toString('base64');

/**
 * Hashea una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Password hasheada
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Compara una contraseña con su hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Password hasheada
 * @returns true si coinciden, false si no
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Genera un token JWT
 * @param payload - Datos a incluir en el token (ej: userId, email)
 * @returns Token JWT firmado
 */
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

/**
 * Verifica y decodifica un token JWT
 * @param token - Token JWT a verificar
 * @returns Payload decodificado o null si es inválido
 */
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Legacy authentication (deprecado, usar hashPassword y comparePassword)
const SECRET = 'angelito';
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
