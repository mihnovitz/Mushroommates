import { getPrismaClient } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

const prisma = getPrismaClient();

export class MushroomService {
    /**
     * Pobierz wszystkie grzyby
     */
    static async getAllMushrooms() {
        return await prisma.mushroom.findMany({
            include: {
                user: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Pobierz pojedynczy grzyb
     */
    static async getMushroomById(id) {
        const mushroom = await prisma.mushroom.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!mushroom) {
            throw new NotFoundError('Grzyb nie został znaleziony');
        }

        return mushroom;
    }

    /**
     * Utwórz nowy grzyb
     */
    static async createMushroom({ name, species, location, latitude, longitude, photo, userId }) {
        return await prisma.mushroom.create({
            data: {
                name,
                species: species || null,
                location,
                latitude: latitude ? parseFloat(latitude) : 0,
                longitude: longitude ? parseFloat(longitude) : 0,
                photo: photo || null,
                userId
            },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });
    }

    /**
     * Zaktualizuj grzyb (tylko właściciel)
     */
    static async updateMushroom(id, updateData, userId) {
        const mushroom = await prisma.mushroom.findUnique({
            where: { id }
        });

        if (!mushroom) {
            throw new NotFoundError('Grzyb nie został znaleziony');
        }

        if (mushroom.userId !== userId) {
            throw new ForbiddenError('Nie masz uprawnień do edycji tego grzyba');
        }

        // Konwertuj latitude i longitude jeśli są podane
        const data = { ...updateData };
        if (data.latitude) data.latitude = parseFloat(data.latitude);
        if (data.longitude) data.longitude = parseFloat(data.longitude);

        return await prisma.mushroom.update({
            where: { id },
            data,
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });
    }

    /**
     * Usuń grzyb (tylko właściciel)
     */
    static async deleteMushroom(id, userId) {
        const mushroom = await prisma.mushroom.findUnique({
            where: { id }
        });

        if (!mushroom) {
            throw new NotFoundError('Grzyb nie został znaleziony');
        }

        if (mushroom.userId !== userId) {
            throw new ForbiddenError('Nie masz uprawnień do usunięcia tego grzyba');
        }

        await prisma.mushroom.delete({
            where: { id }
        });

        return { message: 'Grzyb został usunięty' };
    }
}
