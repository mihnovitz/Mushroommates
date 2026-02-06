import { ForumService } from '../services/forum.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export class ForumController {
    /**
     * GET /api/forum/posts
     */
    static getAllPosts = asyncHandler(async (req, res) => {
        const posts = await ForumService.getAllPosts();

        sendSuccess(res, posts);
    });

    /**
     * GET /api/forum/posts/:id
     */
    static getPostById = asyncHandler(async (req, res) => {
        const post = await ForumService.getPostById(parseInt(req.params.id));

        sendSuccess(res, post);
    });

    /**
     * POST /api/forum/posts
     */
    static createPost = asyncHandler(async (req, res) => {
        const post = await ForumService.createPost({
            ...req.body,
            userId: req.userId
        });

        sendCreated(res, post, 'Post został utworzony');
    });

    /**
     * POST /api/forum/posts/:id/comments
     */
    static addComment = asyncHandler(async (req, res) => {
        const comment = await ForumService.addComment({
            postId: parseInt(req.params.id),
            content: req.body.content,
            userId: req.userId
        });

        sendCreated(res, comment, 'Komentarz został dodany');
    });

    /**
     * DELETE /api/forum/posts/:id
     */
    static deletePost = asyncHandler(async (req, res) => {
        const result = await ForumService.deletePost(
            parseInt(req.params.id),
            req.userId
        );

        sendSuccess(res, result);
    });
}
