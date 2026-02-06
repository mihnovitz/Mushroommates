import express from 'express';
import authRoutes from './auth.js';
import forumRoutes from './forum.routes.js';
import mushroomRoutes from './mushroom.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Mushroommates API is running',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/forum', forumRoutes);
router.use('/mushrooms', mushroomRoutes);

export default router;
