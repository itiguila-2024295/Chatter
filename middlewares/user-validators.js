import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { syncUser } from './syncUser.js';
import { requireRole } from './validate-role.js';

// Validaciones para crear campos (field)
export const validateFinishCreatingUser = [
    validateJWT,
    syncUser,
    body('username')
        .custom((value, { req }) => { //.custom Para hacer que si viene los datos en el token no sean obligatorios en el body
            if (!value && !req.user.username) {
                throw new Error('El nombre de usuario es requerido');
            }
            return true;
        })
        .optional()
        .trim(),
    body('email')
        .custom((value, { req }) => {
            if (!value && !req.user.email) {
                throw new Error('El correo electrónico es requerido');
            }
            return true;
        })
        .optional()
        .isEmail().withMessage('Ingrese un correo válido'),
    body('name')
        .custom((value, { req }) => {
            if (!value && !req.user.name) {
                throw new Error('El nombre es requerido');
            }
            return true;
        })
        .optional(),
    body('birthdate')
        .optional()
        .isISO8601().withMessage('Formato de fecha inválido (AAAA-MM-DD)'),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('La descripción es muy larga'),
    checkValidators
];

export const validateGetUser = [
    validateJWT,
    requireRole('ADMIN_ROLE'),
];


export const validateUpdateUserInfo = [
    validateJWT,
    syncUser,
    body('username')
        .optional()
        .trim(),
    body('name')
        .trim()
        .optional(),
    body('birthdate')
        .optional()
        .isISO8601().withMessage('Formato de fecha inválido (AAAA-MM-DD)'),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('La descripción es muy larga'),
    checkValidators
];
