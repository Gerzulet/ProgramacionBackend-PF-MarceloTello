import fs from 'fs';

class ProductService {

    constructor(path) {
        this.path = path;
    }

    async add(product) {

        const products = await this.getAll();

        if (products.some(p => p.code === product.code)) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        if(!product.title || !product.description || !product.category || !product.price || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        const Product = {
            code: product.code ?? "Sin Nombre",
            title: product.title ?? "Sin titulo",
            description: product.description ?? "Sin Descripción",
            category: product.category ?? "Sin Categoria",
            price: product.price ?? "Sin Precio ",
            thumbnail: product.thumbnail ?? "Sin Imagen",
            stock: product.stock ?? "Agrega un stock válido",
            id: await this.#getId(),
            status: true,
            
        };

        products.push(Product);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            console.log("Producto creado correctamente");
        } catch (e) {
            console.error("Error al crear  el producto \n", e);
        }
        
    }
    
    async getAll() {

        const products = await fs.promises.readFile(this.path, "utf-8");

        try {

            return JSON.parse(products);
        } catch (error) {
            console.error("No hay productos");

            return [];
        }
    }
    
    async #getId() {
        try {
            const products = await this.getAll();
            return products.length === 0 ? 1 : products[products.length - 1].id + 1;
        } catch (error) {
            console.error(error)
            return
        }
    }

    async getById(productId) {
        const products = await this.getAll();
        const product = await products.find(product => product.id === productId);

        try {
            console.log(`Buscando el producto de id ${productId}`)
            return product;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async update(productId,update) {
        try{
            const products = await this.getAll();
            
            const i = products.findIndex(product => product.id === productId);

            if ( i === -1 ) {
                console.error(`No se encontro un producto con el Id : ${productId}`);
            } else {
                const updatedProduct = { ...products[i], ...update };

                products[i] = updatedProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

                console.log(`Producto con el id ${i} fue actualizado correctamente`);
            }
            
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }

    }

    async delete(productId) {
        try {
            const products = await this.getAll();

            const i = products.findIndex(product => product.id === productId);

            if ( i === -1 ) {

                console.error(`No se encontro un producto con el Id : ${productId} , no se elimino nada`);

            } else { 

                products.splice(i,1)   
                

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
                console.log("Producto eliminado correctamente");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
        }
    }

}

export default ProductService;









