import Joi from 'joi';

export const createPostSchema = Joi.object({
    title: Joi.string().min(5).max(200).required().messages({
        'string.min': 'Tytuł musi mieć minimum 5 znaków',
        'string.max': 'Tytuł może mieć maksymalnie 200 znaków',
        'any.required': 'Tytuł jest wymagany'
    }),
    content: Joi.string().min(10).required().messages({
        'string.min': 'Treść musi mieć minimum 10 znaków',
        'any.required': 'Treść jest wymagana'
    }),
    imageUrl: Joi.string().uri().optional().allow('', null)
});

export const createCommentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required().messages({
        'string.min': 'Komentarz nie może być pusty',
        'string.max': 'Komentarz może mieć maksymalnie 1000 znaków',
        'any.required': 'Treść komentarza jest wymagana'
    })
});
