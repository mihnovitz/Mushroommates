import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rejestracja
router.post('/register', validate(registerSchema), AuthController.register);

// Logowanie
router.post('/login', validate(loginSchema), AuthController.login);

// Profil użytkownika (chroniony)
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;
