export default class ProductRepository {
    constructor (dao) {
        this.dao = dao;
    }
    
    async getProducts() {
        return await this.dao.getAll();
    }

    async getProductByID(productId) {
        return await this.dao.getById(productId);
    }

    async addProduct(product) {
        return await this.dao.add(product);
    }

    async updateProduct(productId,update){
        return await this.dao.update(productId,update);
    }

    async deleteProduct(productId) {
        return await this.dao.delete(productId);
    }

}