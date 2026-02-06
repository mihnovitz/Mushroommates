import Joi from 'joi';

export const createMushroomSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Nazwa musi mieć minimum 2 znaki',
        'string.max': 'Nazwa może mieć maksymalnie 100 znaków',
        'any.required': 'Nazwa jest wymagana'
    }),
    species: Joi.string().max(100).optional().allow('', null),
    location: Joi.string().min(2).max(200).required().messages({
        'string.min': 'Lokalizacja musi mieć minimum 2 znaki',
        'any.required': 'Lokalizacja jest wymagana'
    }),
    // Allow empty strings and convert to number
    latitude: Joi.alternatives().try(
        Joi.number().min(-90).max(90),
        Joi.string().allow('').custom((value, helpers) => {
            if (value === '' || value === null || value === undefined) return undefined;
            const num = parseFloat(value);
            if (isNaN(num)) return helpers.error('number.base');
            if (num < -90 || num > 90) return helpers.error('number.max');
            return num;
        })
    ).optional(),
    longitude: Joi.alternatives().try(
        Joi.number().min(-180).max(180),
        Joi.string().allow('').custom((value, helpers) => {
            if (value === '' || value === null || value === undefined) return undefined;
            const num = parseFloat(value);
            if (isNaN(num)) return helpers.error('number.base');
            if (num < -180 || num > 180) return helpers.error('number.max');
            return num;
        })
    ).optional()
});

export const updateMushroomSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    species: Joi.string().max(100).optional().allow('', null),
    location: Joi.string().min(2).max(200).optional(),
    latitude: Joi.alternatives().try(
        Joi.number().min(-90).max(90),
        Joi.string().allow('').custom((value, helpers) => {
            if (value === '' || value === null || value === undefined) return undefined;
            const num = parseFloat(value);
            if (isNaN(num)) return helpers.error('number.base');
            return num;
        })
    ).optional(),
    longitude: Joi.alternatives().try(
        Joi.number().min(-180).max(180),
        Joi.string().allow('').custom((value, helpers) => {
            if (value === '' || value === null || value === undefined) return undefined;
            const num = parseFloat(value);
            if (isNaN(num)) return helpers.error('number.base');
            return num;
        })
    ).optional()
}).min(1); // Przynajmniej jedno pole musi być zaktualizowane
