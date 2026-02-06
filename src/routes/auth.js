import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken } from '../auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Rejestracja
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email już istnieje' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Błąd rejestracji:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// Logowanie
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }

        const validPassword = await verifyPassword(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

export default router;
