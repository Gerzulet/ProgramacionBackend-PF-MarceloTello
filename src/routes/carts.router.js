import express from "express";

import __dirname from '../utils/utils.js';
import CartController from "../controllers/cartController.js"
import { auth, isUser } from "../middlewares/auth.js";


const router = express.Router();
const cartsRouter = router;

const CC = new CartController();

router.post("/", async (req, res) => {
    try {
        const newCart = await CC.create();
        if (!newCart) {
            return res.status(500).json({ error: "No se pudo crear el carrito" });
        }

        req.cartId = newCart._id;
        if (req.user) {
            req.user.cartId = newCart._id;
            await req.user.save();
        }

        res.status(200).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crear el carrito");
    }
});

router.get("/", async (req, res) => {
    try {
        const cartId = req.cartId;
        if (!cartId) {
            return res.status(400).json({ error: "No se ha encontrado el carrito" });
        }

        const cart = await CC.getById(cartId);

        if (!cart) {
            console.error("No se pudo encontrar el carrito con ID:", cartId);
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }

        return res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).send("Error interno del servidor");
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid 

    try {
        const cart = await CC.getById(cartId);
        if (!cart) {
            console.error("No se pudo encontrar el carrito con ID:", cartId);
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }

        const total = cart.products.reduce((sum, product) => sum + (product.product.price * product.quantity), 0);

        const cartData = JSON.parse(JSON.stringify(cart));
        return res.json({ cart: cart, total: total.toFixed(2) });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).send("Error interno del servidor");
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await CC.addProduct(cartId, productId, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid || req.cartId ;
    const productId = req.params.pid;

    try {
        await CC.removeProduct(cartId, productId);
        res.send('Producto eliminado del carrito correctamente');
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid || req.cartId;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await CC.updateQuantity(cartId, productId, quantity);
        res.send('Cantidad de producto actualizada correctamente');
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(500).send('Error al actualizar la cantidad del producto');
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid || req.cartId ;
    const { products } = req.body;

    try {
        await CC.update(cartId, products);
        res.send('Carrito actualizado correctamente');
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).send('Error al actualizar el carrito');
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid || req.cartId ;

    try {
        await CC.removeAllProducts(cartId);
        res.send('Productos eliminados del carrito correctamente');
    } catch (error) {
        console.error("Error al eliminar los productos del carrito:", error);
        res.status(500).send('Error al eliminar los productos del carrito');
    }
});

router.delete('/', async (req,res) => {
    try{
        
    } catch (error){
        console.error("Error al eliminar usuarios con inactividad:", error);
        res.status(500).send('Error al eliminar usuarios con inactividad');
    }
})

router.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid || req.cartId ;
        const userEmail = req.user.email;

        if (!cartId) {
            return res.status(400).json({ error: "No se ha encontrado el carrito" });
        }

        const result = await CC.purchase(cartId, userEmail);
        res.json(result);
    } catch (error) {
        console.error("Error al realizar la compra:", error);
        res.status(500).send(error.message);
    }
});

router.get('/current', auth, async (req, res) => {
    try {
        const cartId = req.session.user.cartId || req.cartId;
        const cart = await CC.getById(cartId);

        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cartId}` });
        }

        return res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).send("Error interno del servidor");
    }
});



export default cartsRouter;