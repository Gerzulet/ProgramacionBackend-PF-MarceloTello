import { UsersService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import { generateUserErrorInfo } from "../services/errors/info.js";

export default class UserController {

    constructor() {
        this.userService = UsersService;
    }

    async getAll() {
        try {
            return await this.userService.getUsers();
        } catch (error) {
            throw CustomError.createError({
                name: "Error al cargar los usuarios",
                cause: error,
                message: EErrors.USER_GET_ALL_FAILED.message,
                statusCode: EErrors.USER_GET_ALL_FAILED.statusCode
            });
        }
    }

    async getById(uid) {
        try {
            const user = await this.userService.getUserById(uid);
            if (!user) {
                throw CustomError.createError({
                    name: "Usuario no encontrado",
                    message: EErrors.USER_NOT_FOUND.message,
                    statusCode: EErrors.USER_NOT_FOUND.statusCode
                });
            }
            return user;
        } catch (error) {
            throw CustomError.createError({
                name: "Error en la busqueda del usuario",
                message: EErrors.USER_GET_BY_ID_FAILED.message,
                statusCode: EErrors.USER_GET_BY_ID_FAILED.statusCode
            });
        }
    }

    async create(user) {
        const { first_name, last_name, email } = user;

        if(!first_name||!last_name||!email){
            CustomError.createError({
                name:"Faltan campos obligatorios",
                cause:generateUserErrorInfo({first_name,last_name,age,email}),
                message:EErrors.MISSING_REQUIRED_FIELDS.message,
                code:EErrors.MISSING_REQUIRED_FIELDS.statusCode
            });
        }

        try {
            return await this.userService.createUser({ first_name, last_name, email });
        } catch (error) {
            throw CustomError.createError({
                name:"Error en la creacion del usuario",
                message:EErrors.USER_CREATE_FAILED.message,
                code:EErrors.USER_CREATE_FAILED.statusCode
            })
        }
    }
}