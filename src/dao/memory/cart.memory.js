import fs from "fs";
import __dirname from "../../utils/utils.js";
import ProductService from "./product.memory.js";

const PS = new ProductService(`${__dirname}/../Productos.json`);

class CartService {

    constructor(path) {
        this.path = path;
    }
    
    async create() {
        const carts = await this.getAll();

        const cart = {
            id: await this.#getId(),
            products: []
        };

        carts.push(cart);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
            console.log("Nuevo carrito creado");
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return null;
        }
    }

    async addProduct(cartId,productId,quantity) {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart.id === cartId)

        if (cartIndex === -1) {
            console.error(`No se encontró el carrito con ID ${cartId}`)
        }

        const products = await PS.getAll();
        const product = products.findIndex(product => product.id === productId)

        if (!product) {
            console.error(`No se encontró el producto con ID ${productId}`)
        }
        
        const cart = carts[cartIndex];

        const productInCart = cart.products.find(item => item.id === productId);
        
        if (productInCart) {
            typeof productInCart.quantity === 'number'
                ? productInCart.quantity += quantity
                : console.error('La cantidad del producto en el carrito no es un número válido.');
        } else {
            cart.products.push({ id: productId, quantity });
        }

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
            console.log("Producto agregado al carrito");
        } catch(error) {
            console.error("Error al agregar el producto al carrito", error);
        }
    }
    
    async getAll() {
        const carts = await fs.promises.readFile(this.path, "utf-8")
        
        try {
            const cartsList = JSON.parse(carts);

            return Array.isArray(cartsList) ? cartsList : [];
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return [];
        }
    }
    
    async getById(cartId) {
        const carts = await this.getAll();
        
        try {
            console.log(`Buscando el carrito con id ${cartId}`);
            const cart = carts.find(cart => cart.id === cartId)

            if (!cart) {   
                console.error("No se encontro este carrito")
            }

            return cart;

        } catch (error) {
            console.error('No se pudo encontrar el carrito con el id solicitado', error) 
            return null;
        }
    }
    
    async #getId() {
        try {
            const carts = await this.getAll();
            return carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
        } catch (error) {
            console.error(error)
            return
        }
    }

}

export default CartService;