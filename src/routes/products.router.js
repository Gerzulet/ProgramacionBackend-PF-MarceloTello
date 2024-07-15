 import express from 'express';
import __dirname from '../utils/utils.js';
import ProductController from '../controllers/productController.js';
import productModel from '../dao/mongo/models/productModel.js';
import { auth, isAdmin } from '../middlewares/auth.js';

const router = express.Router();
const productsRouter = router;

const PC = new ProductController();

router.get('/', async (req, res) => {
    let { page = 1, limit = 10, sort, query } = req.query;

    if (sort) {
        sort = JSON.parse(sort);
    } else {
        sort = { _id: 'asc' }; 
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort,
        lean: true 
    };

    const queryOptions = query ? { title: { $regex: query, $options: 'i' } } : {};

    try {
        const result = await productModel.paginate(queryOptions, options);

        console.log("Productos obtenidos con éxito");
        res.send(result); // Devuelve la respuesta paginada directamente
    } catch (error) {
        console.error("Error al obtener productos");
        res.status(500).send('Error al obtener los productos', error);
    }
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;

    try{
        let product = await PC.getAll(productId);

        if (!product) {
            console.error("No se encontró el producto solicitado");
            return res.status(404).json({
                error: `No se encontró el producto con ID ${productId}`
            });
        }

        res.json(product);

    } catch (e) {
        console.error("Error al obtener el producto por Id")
        res.status(500).send(`Error al obtener el producto`,e)
    }

    
});

router.post('/',auth, isAdmin, async (req, res) => {

    const product = req.body;

    try {
        await PC.add(product);
        res.status(201).send('Producto creado correctamente');
    } catch (error) {
        console.error("Error al crear el producto");
        res.status(500).send('Error al crear el producto', error);
    }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
    const productId = req.params.id;

    const update = req.body;

    try {
        await PC.update(productId, update);
        res.send('Producto actualizado correctamente');
    } catch (error) {
        console.error("Error al actualizar el producto");
        res.status(500).send('Error al actualizar el producto', error);
    }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
    const productId = req.params.id;
    
    try {
        await PC.delete(productId);
        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error("Error al eliminar el producto:");
        res.status(500).send('Error al eliminar el producto', error);
    }
});

router.post('/deleteproduct', auth, isAdmin, async (req, res) => {
    const productId = req.body.productId;

    try {
        await PC.delete(productId);
        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error("Error al eliminar el producto:");
        res.status(500).send('Error al eliminar el producto', error);
    }
});

export default productsRouter;

