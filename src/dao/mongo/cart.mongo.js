import cartModel from "./models/cartModel.js";
import productModel from "./models/productModel.js";

export default class CartService {

    async create() {
        try {
            const result = await cartModel.create({ products: [] }); 
            console.log("Nuevo carrito creado");
            return result;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return null;
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                console.error(`El producto con ID ${productId} no existe`);
                return;
            }
    
            const result = await cartModel.updateOne(
                { _id: cartId },
                { $addToSet: { products: { product: productId, quantity } } }
            );
    
            if (result.nModified === 0) {
                await cartModel.updateOne(
                    { _id: cartId, 'products.product': productId },
                    { $inc: { 'products.$.quantity': quantity } }
                );
            }
    
            console.log("Producto agregado al carrito");
        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
        }
    }

    async getAll() {
        try {
            return await cartModel.find().lean();
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return [];
        }
    }

    async getById(cartId) {
        try {
            const cart = await cartModel.findOne({_id: cartId}).populate('products.product');

            if (!cart) {
                console.error("No se encontro este carrito");
                return null;
            } else {
                console.log(`Se encontro el carrito con el id ${cartId}`)
            }
            
            return cart;
        } catch (error) {
            console.error(`No se pudo encontrar el carrito con el id solicitado:${cartId}`, error);
            return null;
        }
    }

    async removeAllProducts(cartId) {
        try {
            await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: [] } }
            );
    
            console.log("Productos eliminados del carrito correctamente");
        } catch (error) {
            console.error("Error al eliminar los productos del carrito:", error);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            await cartModel.updateOne(
                { _id: cartId },
                { $pull: { products: { product: productId } } }
            );
    
            console.log("Producto eliminado del carrito");
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
        }
    }

    async update(cartId, productsData) {
        try {
            const updatedProducts = productsData.map(productData => ({
                product: productData.productId,
                quantity: productData.quantity
            }));
    
            const result = await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: updatedProducts } }
            );
    
            if (result.nModified > 0) {
                console.log("Carrito actualizado correctamente");
            } else {
                console.error(`No se encontró el carrito con ID ${cartId}`);
            }
    
            return result;
        } catch (error) {
            console.error(`Error al actualizar el carrito con ID ${cartId}`, error);
            throw error;
        }
    }

    async updateQuantity(cartId, productId, quantity) {
        try {
            await cartModel.updateOne(
                { _id: cartId, 'products.product': productId },
                { $set: { 'products.$.quantity': quantity } }
            );
    
            console.log("Cantidad de producto actualizada en el carrito");
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
        }
    }

    async delete(cartId) {
        try {

            const result = await cartModel.deleteOne({ _id: cartId });
            console.log("Carrito eliminado correctamente");
            if (result.deletedCount === 0) throw new Error(`El carrito ${cartId} no existe`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al eliminar el carrito ${cartId}`);
        }
    }

}

