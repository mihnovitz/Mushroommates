import express from 'express';
import { ForumController } from '../controllers/forum.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createPostSchema, createCommentSchema } from '../validators/forum.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publiczne
router.get('/posts', ForumController.getAllPosts);
router.get('/posts/:id', ForumController.getPostById);

// Chronione (wymagają autoryzacji)
router.post('/posts', authMiddleware, validate(createPostSchema), ForumController.createPost);
router.post('/posts/:id/comments', authMiddleware, validate(createCommentSchema), ForumController.addComment);
router.delete('/posts/:id', authMiddleware, ForumController.deletePost);

export default router;
