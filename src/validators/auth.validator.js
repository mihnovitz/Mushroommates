import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Imię musi mieć minimum 2 znaki',
        'string.max': 'Imię może mieć maksymalnie 50 znaków',
        'any.required': 'Imię jest wymagane'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Nieprawidłowy adres email',
        'any.required': 'Email jest wymagany'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Hasło musi mieć minimum 6 znaków',
        'any.required': 'Hasło jest wymagane'
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Nieprawidłowy adres email',
        'any.required': 'Email jest wymagany'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Hasło jest wymagane'
    })
});
