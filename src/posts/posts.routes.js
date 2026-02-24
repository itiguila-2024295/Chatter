import { Router } from 'express';
import { createPost, updatePost, getPosts, deletePost } from './posts.controller.js';
import { uploadFieldImage } from '../../middlewares/file-uploader.js';
import { cleanUploaderFileOnFinish } from '../../middlewares/delete-file-on-error.js';
import { validatePost, validateUpdatePost, validateDeletePost  } from '../../middlewares/posts-validators.js';

const router = Router();

router.post(
    '/createPost',
    uploadFieldImage.single('image'),
    cleanUploaderFileOnFinish,
    validatePost,
    createPost
)

router.get(
    '/getPosts',
    getPosts
)

router.put(
    '/updatePost/:id',
    uploadFieldImage.single('image'),
    cleanUploaderFileOnFinish,
    validateUpdatePost,
    updatePost
);

router.delete(
    '/deletePost/:id',
    validateDeletePost,
    deletePost
);

export default router;
