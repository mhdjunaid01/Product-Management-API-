const errorHandler = (err, req, res, next) => {
    console.error("Error:", err); // Logs error in the console for debugging

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((error) => error.message).join(", ");
    }

    // Handle MongoDB Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    }

    // Handle Unauthorized Errors (JWT, Authentication)
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = err.name === "JsonWebTokenError" ? "Invalid Token, please log in again." : "Token has expired, please log in again.";
    }

    // Send formatted error response
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

export default errorHandler;