import express from 'express';
import { MushroomController } from '../controllers/mushroom.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createMushroomSchema, updateMushroomSchema } from '../validators/mushroom.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// Publiczne
router.get('/', MushroomController.getAllMushrooms);
router.get('/:id', MushroomController.getMushroomById);

// Chronione (wymagają autoryzacji)
router.post('/',
    authMiddleware,
    upload.single('image'),
    validate(createMushroomSchema),
    MushroomController.createMushroom
);

router.put('/:id',
    authMiddleware,
    validate(updateMushroomSchema),
    MushroomController.updateMushroom
);

router.delete('/:id', authMiddleware, MushroomController.deleteMushroom);

export default router;
