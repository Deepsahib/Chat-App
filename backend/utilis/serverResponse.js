// utils/errorResponse.js

export const errorResponse = (res, message = "Something went wrong", statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
// utils/successResponse.js

export const successResponse = (
    res,
    message = "Success",
    statusCode = 200,
    data = null
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};


