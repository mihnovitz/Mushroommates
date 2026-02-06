import { ValidationError } from '../utils/errors.js';

/**
 * Middleware do walidacji danych wejściowych
 * @param {Object} schema - Joi schema
 * @param {string} property - 'body', 'query', 'params'
 */
export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Zbierz wszystkie błędy
            stripUnknown: true // Usuń nieznane pola
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(new ValidationError(errors[0].message));
        }

        // Zamień oryginalne dane na zwalidowane (z usuniętymi nieznanymi polami)
        req[property] = value;
        next();
    };
};
