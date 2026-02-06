import dotenv from 'dotenv';
import app from './app.js';
import logger from './utils/logger.js';
import { getPrismaClient, disconnectDatabase } from './config/database.js';

// Załaduj zmienne środowiskowe
dotenv.config();

const PORT = process.env.PORT || 3000;
const prisma = getPrismaClient();

// Sprawdź połączenie z bazą danych
async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        logger.info('✅ Połączono z bazą danych PostgreSQL');
    } catch (error) {
        logger.error('❌ Błąd połączenia z bazą danych:', error);
        process.exit(1);
    }
}

// Uruchom serwer
async function startServer() {
    try {
        await checkDatabaseConnection();

        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${PORT}`);
            logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            logger.info(`\n${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                logger.info('✅ HTTP server closed');

                await disconnectDatabase();
                logger.info('✅ Database connection closed');

                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('❌ Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Obsługa nieobsłużonych błędów
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Start
startServer();
