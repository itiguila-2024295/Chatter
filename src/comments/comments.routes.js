import { Router } from 'express';
import { addComment, getComments, updateComment, deleteComment } from './comments.controller.js';
import { validateCreateComment, validateUpdateComment, validateDeleteComment } from '../../middlewares/comments-validators.js';

const router = Router();

router.post(
    '/createComment',
    validateCreateComment,
    addComment
)

router.get(
    '/getComments/:postId',
    getComments
)
/
router.put(
    '/updateComment/:id',
    validateUpdateComment,
    updateComment
);

router.delete(
    '/deleteComment/:id',
    validateDeleteComment,
    deleteComment
);

export default router;