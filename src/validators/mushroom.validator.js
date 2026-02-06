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
    latitude: Joi.number().min(-90).max(90).optional().allow('', null),
    longitude: Joi.number().min(-180).max(180).optional().allow('', null)
});

export const updateMushroomSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    species: Joi.string().max(100).optional().allow('', null),
    location: Joi.string().min(2).max(200).optional(),
    latitude: Joi.number().min(-90).max(90).optional().allow('', null),
    longitude: Joi.number().min(-180).max(180).optional().allow('', null)
}).min(1); // Przynajmniej jedno pole musi być zaktualizowane
