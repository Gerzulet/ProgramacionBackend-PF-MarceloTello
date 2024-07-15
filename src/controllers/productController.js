import { ProductsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

export default class ProductController {

    constructor() {
        this.productService = ProductsService;
    }

    async add(product) {
        const { title, description, code, price, stock, category, thumbnails } = product;

        if (!title || !code || !category || !price) {
            CustomError.createError({
                name: "Campos requeridos faltantes",
                message: EErrors.MISSING_REQUIRED_FIELDS.message,
                statusCode: EErrors.MISSING_REQUIRED_FIELDS.statusCode,
                cause: generateProductErrorInfo({title, code, category, price})
            });
        }

        try {
            return await this.productService.addProduct({ title, description, code, price, stock, category, thumbnails: thumbnails ?? [] });
        } catch (error) {
            throw CustomError.createError({
                name: "Error al agregar producto",
                message: EErrors.PRODUCT_ADD_FAILED.message,
                statusCode: EErrors.PRODUCT_ADD_FAILED.statusCode,
                cause: error,
            });
        }
    }

    async getAll() {
        try {
            return await this.productService.getProducts();
        } catch (error) {
            throw CustomError.createError({
                name: "Error al obtener todos los productos",
                message: EErrors.PRODUCT_GET_ALL_FAILED.message,
                statusCode: EErrors.PRODUCT_GET_ALL_FAILED.statusCode,
                cause: error,
            });
        }
    }

    async getByID(productId) {
        try {
            const product = await this.productService.getProductById(productId);
            if (!product) {
                throw CustomError.createError({
                    name: "Producto no encontrado",
                    message: EErrors.PRODUCT_NOT_FOUND.message,
                    statusCode: EErrors.PRODUCT_NOT_FOUND.statusCode,
                });
            }
            return product;
        } catch (error) {
            throw CustomError.createError({
                name: "Error al obtener producto por ID",
                message: EErrors.PRODUCT_GET_BY_ID_FAILED.message,
                statusCode: EErrors.PRODUCT_GET_BY_ID_FAILED.statusCode,
                cause: error,
            });
        }
    }

    async update(productId, update) {
        if (!productId || !update) {
            throw CustomError.createError({
                name: "Campos requeridos faltantes para actualizar",
                message: EErrors.MISSING_REQUIRED_FIELDS.message,
                statusCode: EErrors.MISSING_REQUIRED_FIELDS.statusCode,
            });
        }
        try {
            return await this.productService.updateProduct(productId, update);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al actualizar producto",
                message: EErrors.PRODUCT_UPDATE_FAILED.message,
                statusCode: EErrors.PRODUCT_UPDATE_FAILED.statusCode,
                cause: error,
            });
        }
    }

    async delete(productId) {
        try {
            return await this.productService.deleteProduct(productId);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al eliminar producto",
                message: EErrors.PRODUCT_DELETE_FAILED.message,
                statusCode: EErrors.PRODUCT_DELETE_FAILED.statusCode,
                cause: error,
            });
        }
    }
}