import { getPrismaClient } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

const prisma = getPrismaClient();

export class ForumService {
    /**
     * Pobierz wszystkie posty
     */
    static async getAllPosts() {
        return await prisma.post.findMany({
            include: {
                user: {
                    select: { id: true, name: true }
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Pobierz pojedynczy post z komentarzami
     */
    static async getPostById(postId) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: { id: true, name: true }
                },
                comments: {
                    include: {
                        user: { select: { id: true, name: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!post) {
            throw new NotFoundError('Post nie został znaleziony');
        }

        return post;
    }

    /**
     * Utwórz nowy post
     */
    static async createPost({ title, content, imageUrl, userId }) {
        return await prisma.post.create({
            data: {
                title,
                content,
                imageUrl: imageUrl || null,
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
     * Dodaj komentarz do posta
     */
    static async addComment({ postId, content, userId }) {
        // Sprawdź czy post istnieje
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new NotFoundError('Post nie został znaleziony');
        }

        return await prisma.comment.create({
            data: {
                content,
                postId,
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
     * Usuń post (tylko właściciel)
     */
    static async deletePost(postId, userId) {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new NotFoundError('Post nie został znaleziony');
        }

        if (post.userId !== userId) {
            throw new ForbiddenError('Nie masz uprawnień do usunięcia tego posta');
        }

        await prisma.post.delete({
            where: { id: postId }
        });

        return { message: 'Post został usunięty' };
    }
}
