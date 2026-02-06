import { verifyToken } from '../auth.js';
import { UnauthorizedError } from '../utils/errors.js';
import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Token nie został dostarczony');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('Token nie został dostarczony');
        }

        const decoded = verifyToken(token);

        // Pobierz użytkownika z bazy
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            throw new UnauthorizedError('Użytkownik nie istnieje');
        }

        req.userId = user.id;
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new UnauthorizedError('Nieprawidłowy token'));
        } else if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError('Token wygasł'));
        } else {
            next(error);
        }
    }
};

// Opcjonalna autoryzacja (nie rzuca błędu gdy brak tokena)
export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, name: true }
            });

            if (user) {
                req.userId = user.id;
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // Ignoruj błędy w opcjonalnej autoryzacji
        next();
    }
};
