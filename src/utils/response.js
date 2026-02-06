// Standardowe odpowiedzi API
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const sendError = (res, message, statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

export const sendCreated = (res, data, message = 'Resource created successfully') => {
    sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res) => {
    res.status(204).send();
};
