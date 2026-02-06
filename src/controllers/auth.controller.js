import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendSuccess } from '../utils/response.js';

export class AuthController {
    /**
     * POST /api/auth/register
     */
    static register = asyncHandler(async (req, res) => {
        const { user, token } = await AuthService.register(req.body);

        sendSuccess(res, { user, token }, 'Rejestracja zakończona pomyślnie', 201);
    });

    /**
     * POST /api/auth/login
     */
    static login = asyncHandler(async (req, res) => {
        const { user, token } = await AuthService.login(req.body);

        sendSuccess(res, { user, token }, 'Zalogowano pomyślnie');
    });

    /**
     * GET /api/auth/profile
     */
    static getProfile = asyncHandler(async (req, res) => {
        const user = await AuthService.getProfile(req.userId);

        sendSuccess(res, user);
    });
}
