import { MushroomService } from '../services/mushroom.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export class MushroomController {
    /**
     * GET /api/mushrooms
     */
    static getAllMushrooms = asyncHandler(async (req, res) => {
        const mushrooms = await MushroomService.getAllMushrooms();

        sendSuccess(res, mushrooms);
    });

    /**
     * GET /api/mushrooms/:id
     */
    static getMushroomById = asyncHandler(async (req, res) => {
        const mushroom = await MushroomService.getMushroomById(parseInt(req.params.id));

        sendSuccess(res, mushroom);
    });

    /**
     * POST /api/mushrooms
     */
    static createMushroom = asyncHandler(async (req, res) => {
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        const mushroom = await MushroomService.createMushroom({
            ...req.body,
            photo,
            userId: req.userId
        });

        sendCreated(res, mushroom, 'Grzyb został dodany');
    });

    /**
     * PUT /api/mushrooms/:id
     */
    static updateMushroom = asyncHandler(async (req, res) => {
        const mushroom = await MushroomService.updateMushroom(
            parseInt(req.params.id),
            req.body,
            req.userId
        );

        sendSuccess(res, mushroom, 'Grzyb został zaktualizowany');
    });

    /**
     * DELETE /api/mushrooms/:id
     */
    static deleteMushroom = asyncHandler(async (req, res) => {
        const result = await MushroomService.deleteMushroom(
            parseInt(req.params.id),
            req.userId
        );

        sendSuccess(res, result);
    });
}
