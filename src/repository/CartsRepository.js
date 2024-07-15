export default class CartRepository {
    constructor (dao) {
        this.dao = dao;
    }

    async createCart() {
        return await this.dao.create();
    }

    async addProductToCart(cartId, productId, quantity) {
        return await this.dao.addProduct(cartId, productId, quantity)
    }

    async getCarts() {
        return await this.dao.getAll();
    }

    async getCartById(cartId) {
        return await this.dao.getById(cartId);
    }

    async removeAllProductsToCart(cartId) {
        return await this.dao.removeAllProducts(cartId);
    }

    async removeProductToCart(cartId, productId) {
        return await this.dao.removeProduct(cartId, productId);
    }

    async updateCart(cartId,productsData){
        return await this.dao.update(cartId,productsData);
    }
    
    async updateProductQuantity(cartId,productId, quantity){
        return await this.dao.updateQuantity(cartId,productId, quantity);
    }

    async deleteCart(cartId) {
        return await this.dao.delete(cartId);
    }

    async purchaseCart(cartId, userEmail) {
        return await this.dao.purchase(cartId, userEmail);
    }
}

