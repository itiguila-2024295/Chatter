import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { syncUser } from './syncUser.js';
import { requireRole } from './validate-role.js';

export const validatePost = [
    validateJWT, 
    syncUser,    
    body('title')
        .trim()
        .notEmpty().withMessage('El título de la publicación es obligatorio')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres'),
    body('category')
        .trim()
        .notEmpty().withMessage('La categoría es obligatoria')
        .isIn(['Tecnología', 'Salud', 'Educación', 'Entretenimiento', 'Deportes', 'Negocios', 'Ciencia', 'Arte', 'Viajes', 'Gastronomía', 'Otros'])
        .withMessage('La categoría debe ser una de las siguientes: Tecnología, Salud, Educación, Entretenimiento, Deportes, Negocios, Ciencia, Arte, Viajes, Gastronomía o Otros'),
    body('content')
        .trim()
        .notEmpty().withMessage('El texto principal (contenido) es obligatorio')
        .isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
    checkValidators // 3. Captura y responde si hay errores
];

export const validateUpdatePost = [
    validateJWT, 
    syncUser,
    body('title')  
        .optional()
        .trim()
        .notEmpty().withMessage('El título de la publicación no puede estar vacío')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres'),
    body('category')
        .optional()
        .trim()
        .notEmpty().withMessage('La categoría no puede estar vacía')
        .isIn(['Tecnología', 'Salud', 'Educación', 'Entretenimiento', 'Deportes', 'Negocios', 'Ciencia', 'Arte', 'Viajes', 'Gastronomía', 'Otros'])
        .withMessage('La categoría debe ser una de las siguientes: Tecnología, Salud, Educación, Entretenimiento, Deportes, Negocios, Ciencia, Arte, Viajes, Gastronomía o Otros'),
    body('content')
        .optional()
        .trim()
        .notEmpty().withMessage('El texto principal (contenido) no puede estar vacío')
        .isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
    checkValidators // Captura y responde si hay errores
];

export const validateDeletePost = [
    validateJWT, 
    syncUser,
    checkValidators
];