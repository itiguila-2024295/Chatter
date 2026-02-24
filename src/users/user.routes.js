import { Router } from 'express';
import { finishCreateUser, getUsers, updateUserInfo } from './user.controler.js';
import { validateFinishCreatingUser, validateGetUser, validateUpdateUserInfo } from '../../middlewares/user-validators.js';

const router = Router();

router.post(
    '/finishCreate',
    validateFinishCreatingUser,
    finishCreateUser
)

router.get(
    '/get',
    validateGetUser,
    getUsers
)

router.put(
    '/updateUserInfo',
    validateUpdateUserInfo,
    updateUserInfo
);

export default router;
