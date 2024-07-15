import { TicketsService, ProductsService, CartsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import { generateCartErrorInfo } from "../services/errors/info.js";

export default class CartController {

    constructor() {
        this.cartService = CartsService;
        this.ticketService = TicketsService;
        this.productService = ProductsService;
    }

    async create() {
        try {
            return await this.cartService.createCart();
        } catch (error) {
            throw CustomError.createError({
                name: "Error al crear carrito",
                cause: error,
                message: EErrors.CART_CREATE_FAILED.message,
                statusCode: EErrors.CART_CREATE_FAILED.statusCode
            });
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            return await this.cartService.addProductToCart(cartId, productId, quantity);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al añadir producto al carrito",
                cause: error,
                message: EErrors.CART_ADD_PRODUCT_FAILED.message,
                statusCode: EErrors.CART_ADD_PRODUCT_FAILED.statusCode
            });
        }
    }

    async getAll() {
        try {
            return await this.cartService.getCarts();
        } catch (error) {
            throw CustomError.createError({
                name: "Error al obtener todos los carritos",
                cause: error,
                message: EErrors.CART_GET_ALL_FAILED.message,
                statusCode: EErrors.CART_GET_ALL_FAILED.statusCode
            });
        }
    }

    async getById(cartId) {
        try {
            const cart = await this.cartService.getCartById(cartId);
            if (!cart) {
                throw CustomError.createError({
                    name: "Carrito no encontrado",
                    message: EErrors.CART_NOT_FOUND.message,
                    statusCode: EErrors.CART_NOT_FOUND.statusCode
                });
            }
            return cart;
        } catch (error) {
            throw CustomError.createError({
                name: "Error al obtener carrito por ID",
                cause: error,
                message: EErrors.CART_GET_BY_ID_FAILED.message,
                statusCode: EErrors.CART_GET_BY_ID_FAILED.statusCode
            });
        }
    }

    async removeAllProducts(cartId) {
        try {
            return await this.cartService.removeAllProductsToCart(cartId);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al eliminar todos los productos del carrito",
                cause: error,
                message: EErrors.CART_REMOVE_ALL_PRODUCTS_FAILED.message,
                statusCode: EErrors.CART_REMOVE_ALL_PRODUCTS_FAILED.statusCode
            });
        }
    }

    async removeProduct(cartId, productId) {
        try {
            return await this.cartService.removeProductToCart(cartId, productId);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al eliminar producto del carrito",
                cause: error,
                message: EErrors.CART_REMOVE_PRODUCT_FAILED.message,
                statusCode: EErrors.CART_REMOVE_PRODUCT_FAILED.statusCode
            });
        }
    }

    async update(cartId, productsData) {
        if (!cartId || !productsData) {
            throw CustomError.createError({
                name: "Campos obligatorios faltantes",
                message: EErrors.MISSING_REQUIRED_FIELDS.message,
                statusCode: EErrors.MISSING_REQUIRED_FIELDS.statusCode
            });
        }
        try {
            return await this.cartService.updateCart(cartId, productsData);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al actualizar carrito",
                cause: error,
                message: EErrors.CART_UPDATE_FAILED.message,
                statusCode: EErrors.CART_UPDATE_FAILED.statusCode
            });
        }
    }

    async updateQuantity(cartId, productId, quantity) {
        try {
            return await this.cartService.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al actualizar cantidad de producto en carrito",
                cause: error,
                message: EErrors.CART_UPDATE_QUANTITY_FAILED.message,
                statusCode: EErrors.CART_UPDATE_QUANTITY_FAILED.statusCode
            });
        }
    }

    async purchaseCart(cartId, userEmail) {
        try {
            const cart = await this.cartService.getCartById(cartId);
            if (!cart) {
                throw CustomError.createError({
                    name: "Carrito no encontrado",
                    message: EErrors.CART_NOT_FOUND.message,
                    statusCode: EErrors.CART_NOT_FOUND.statusCode
                });
            }

            let totalAmount = 0;
            let productsNotProcessed = [];

            await Promise.all(cart.products.map(async (item) => {
                const product = await this.productService.getProductByID(item.product._id);

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await this.productService.update(product._id, product);
                    totalAmount += product.price * item.quantity;
                } else {
                    productsNotProcessed.push(item.product._id);
                }
            }));

            if (totalAmount > 0) {
                const ticket = await this.ticketService.createTicket({
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: userEmail,
                });

                cart.products = cart.products.filter(item => !productsNotProcessed.includes(item.product._id));
                await this.cartService.updateCart(cartId, cart);

                return { ticket, productsNotProcessed };
            } else {
                throw CustomError.createError({
                    name: "No hay productos disponibles para comprar",
                    message: EErrors.NO_PRODUCTS_AVAILABLE.message,
                    statusCode: EErrors.NO_PRODUCTS_AVAILABLE.statusCode
                });
            }
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            throw CustomError.createError({
                name: "Error al procesar la compra",
                cause: error,
                message: EErrors.PURCHASE_CART_FAILED.message,
                statusCode: EErrors.PURCHASE_CART_FAILED.statusCode
            });
        }
    }

    async delete(cartId) {
        try {
            return await this.cartService.deleteCart(cartId);
        } catch (error) {
            throw CustomError.createError({
                name: "Error al eliminar carrito",
                cause: error,
                message: EErrors.CART_DELETE_FAILED.message,
                statusCode: EErrors.CART_DELETE_FAILED.statusCode
            });
        }
    }
}
