import productModel from './models/productModel.js';

export default class ProductService {

    async add(product) {
        const result = await productModel.create(product);

        return result;
    }
    
    async getAll() {
        try {
            let response = await productModel.find().explain('executionStats');
            console.log(response)
            
            return await productModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los productos")
        }
    }

    async getById(productId) {
        try {
            const product = await productModel.findOne({_id: productId});

            if (!product) throw new Error(`El producto ${productId} no existe`)

            return product;
        } catch (e) {
            console.error(error.message);
            throw new Error("Error al obtener el producto")
        }
        
    }

    async update(productId,update) {
        try{
            const result = await productModel.updateOne({_id: productId}, update);

            return result;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }

    }

    async delete(productId) {
        try {
            const result = await productModel.deleteOne({_id: productId});
                   
            console.log("Producto eliminado correctamente");
            if (result.deletedCount === 0) throw new Error(`El producto ${productoId} no existe`)
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al eliminar el producto ${productId}`)
        }
    }
}

