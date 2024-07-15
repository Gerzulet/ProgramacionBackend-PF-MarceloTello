import { MessagesService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";

export default class MessageController {

    constructor() {
        this.messageService = MessagesService;
    }

    async add(user, message) {
        try {
            return await this.messageService.addMessage(user, message);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al agregar mensaje",
                cause: error,
                message: EErrors.MESSAGE_ADD_FAILED.message,
                statusCode: EErrors.MESSAGE_ADD_FAILED.statusCode
            });
        }
    }

    async getAll() {
        try {
            return await this.messageService.getMessages();
        } catch (error) {
            throw CustomError.createError({
                name: "Error al obtener todos los mensajes",
                cause: error,
                message: EErrors.MESSAGE_GET_ALL_FAILED.message,
                statusCode: EErrors.MESSAGE_GET_ALL_FAILED.statusCode
            });
        }
    }
}    