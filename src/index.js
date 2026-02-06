import express from 'express';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth.js';

const { PrismaClient } = pkg;

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ROUTES
app.use('/api/auth', authRoutes);

// Middleware autoryzacji
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const { userId } = verifyToken(token);
        req.userId = userId;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Publiczne endpointy
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mushroommates API is running' });
});

// Chronione endpointy
app.get('/users', authMiddleware, async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Publiczny endpoint
app.get('/api/users-public', async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true }
    });
    res.json(users);
});

// Pobranie wszystkich grzybów (publiczne)
app.get('/api/mushrooms', async (req, res) => {
    const mushrooms = await prisma.mushroom.findMany({
        include: { user: { select: { id: true, name: true } } }
    });
    res.json(mushrooms);
});

// Dodanie grzyba (wymaga autoryzacji)
app.post('/api/mushrooms', authMiddleware, async (req, res) => {
    const { name, species, location, latitude, longitude, photo } = req.body;

    const mushroom = await prisma.mushroom.create({
        data: {
            name,
            species,
            location,
            latitude,
            longitude,
            photo,
            userId: req.userId
        }
    });
    res.json(mushroom);
});

// Edycja grzyba (tylko własne)
app.put('/api/mushrooms/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const mushroom = await prisma.mushroom.findUnique({ where: { id: parseInt(id) } });

    if (!mushroom || mushroom.userId !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.mushroom.update({
        where: { id: parseInt(id) },
        data: req.body
    });
    res.json(updated);
});

// Usunięcie grzyba (tylko własne)
app.delete('/api/mushrooms/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const mushroom = await prisma.mushroom.findUnique({ where: { id: parseInt(id) } });

    if (!mushroom || mushroom.userId !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.mushroom.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Mushroom deleted' });
});

// FORUM - Pobierz wszystkie wątki (posty)
app.get('/api/forum/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: { select: { id: true, name: true } },
                comments: { select: { id: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pobierz jeden wątek z komentarzami
app.get('/api/forum/posts/:id', async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: { select: { id: true, name: true } },
                comments: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Utwórz nowy wątek (wymaga logowania)
app.post('/api/forum/posts', authMiddleware, async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const post = await prisma.post.create({
            data: { title, content, imageUrl, userId: req.userId },
            include: { user: { select: { id: true, name: true } } }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dodaj komentarz do wątku (wymaga logowania)
app.post('/api/forum/posts/:id/comments', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(req.params.id),
                userId: req.userId
            },
            include: { user: { select: { id: true, name: true } } }
        });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
