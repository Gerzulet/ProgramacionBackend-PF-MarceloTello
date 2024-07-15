export default class CustomError {
    static createError({ name = 'Error', cause, message, statusCode }) {
        const error = new Error(message, { cause });
        error.name = name;
        error.statusCode = statusCode;
        throw error;
    }
}