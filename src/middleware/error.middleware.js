import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

/**
 * Centralna obsługa błędów
 */
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log błędu
    logger.error(`${err.name}: ${err.message}`, {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        stack: err.stack
    });

    // Błędy Prisma
    if (err.code === 'P2002') {
        error.message = 'Duplikat wartości. Ten zasób już istnieje.';
        error.statusCode = 409;
    }

    if (err.code === 'P2025') {
        error.message = 'Zasób nie został znaleziony';
        error.statusCode = 404;
    }

    // Błędy Multer
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            error.message = 'Plik jest zbyt duży. Maksymalny rozmiar to 5MB';
        } else {
            error.message = 'Błąd podczas uploadu pliku';
        }
        error.statusCode = 400;
    }

    // Błędy walidacji
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
    }

    // Zwróć odpowiedź
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Błąd serwera';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Obsługa nieznanych route'ów
 */
export const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Nie znaleziono: ${req.originalUrl}`, 404);
    next(error);
};

/**
 * Async handler - wrapper dla async funkcji
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
