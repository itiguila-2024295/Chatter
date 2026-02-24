import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { syncUser } from './syncUser.js';

export const validateCreateComment = [
    validateJWT,
    syncUser,
    body('text')
        .trim()
        .notEmpty().withMessage('El texto del comentario es obligatorio'),
    body('postId')
        .trim()
        .notEmpty().withMessage('El ID de la publicación es obligatorio'),
    checkValidators
];

export const validateUpdateComment = [
    validateJWT,
    syncUser,  
    body('text')
        .optional()
        .trim()
        .notEmpty().withMessage('El texto del comentario no puede estar vacío'),
    checkValidators
];

export const validateDeleteComment = [
    validateJWT,
    syncUser,
    checkValidators
];