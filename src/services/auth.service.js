import { getPrismaClient } from '../config/database.js';
import { hashPassword, verifyPassword, generateToken } from '../auth.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';

const prisma = getPrismaClient();

export class AuthService {
    /**
     * Rejestracja nowego użytkownika
     */
    static async register({ name, email, password }) {
        // Sprawdź czy użytkownik już istnieje
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictError('Użytkownik z tym emailem już istnieje');
        }

        // Hash hasła
        const hashedPassword = await hashPassword(password);

        // Utwórz użytkownika
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        // Generuj token
        const token = generateToken(user.id);

        return { user, token };
    }

    /**
     * Logowanie użytkownika
     */
    static async login({ email, password }) {
        // Znajdź użytkownika
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedError('Nieprawidłowy email lub hasło');
        }

        // Sprawdź hasło
        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedError('Nieprawidłowy email lub hasło');
        }

        // Generuj token
        const token = generateToken(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        };
    }

    /**
     * Pobierz profil użytkownika
     */
    static async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                        mushrooms: true
                    }
                }
            }
        });

        return user;
    }
}
