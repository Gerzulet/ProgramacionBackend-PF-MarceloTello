import express from 'express';
import __dirname from '../utils/utils.js';

import ProductController from '../controllers/productController.js';
import productModel from '../dao/mongo/models/productModel.js';
import CartController from '../controllers/cartController.js';
import { generateProducts } from '../utils/utilsmock.js';
import EErrors from '../services/errors/EErrors.js';
import CustomError from '../services/errors/CustomError.js';

import { auth, logged, isAdmin, isUser } from '../middlewares/auth.js'
import { generateProductErrorInfo } from '../services/errors/info.js';

const router = express.Router();

const PC = new ProductController();
const CC = new CartController();

router.get('/', auth, async (req, res) => {
    let { page = 1, limit = 10, sortField, sortOrder, query } = req.query;

    let sort = {};
    if (sortField) {
        sort[sortField] = sortOrder === 'desc' ? -1 : 1;
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

        const baseURL = "http://localhost:8080";
        result.prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}&limit=${limit}&sort=${encodeURIComponent(JSON.stringify(sort))}&sortField=${sortField}&sortOrder=${sortOrder}` : "";
        result.nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}&limit=${limit}&sort=${encodeURIComponent(JSON.stringify(sort))}&sortField=${sortField}&sortOrder=${sortOrder}` : "";        
        result.isValid = !(page <= 0 || page > result.totalPages);

        console.log("Productos obtenidos con éxito");
        res.render('index', {
            products: result.docs,
            style: 'index.css',
            ...result,
            user: req.session.user
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get("/profile", auth, (req, res) => {
    try {
        res.render(
            'index',
            {
                title: 'Perfil',
                style: 'user.css',
                user: req.session.user
            }
        )
    } catch(e){
        console.error('Error al cargar el perfil', e);
        res.status(500).send("Error al cargar el perfil en el servidor");
    }
}); 

router.get('/realtimeproducts', auth, isAdmin, async (req, res) => {
    try {
        const products = await PC.getAll();
        res.render('realtimeproducts', {
            products,
            style: 'index.css'
        });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real");
        res.status(500).send('Error al obtener los productos en tiempo real', error);
    }
});

router.get('/mockingproducts', auth, isUser, async (req, res) => {
    try {
        const products = generateProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al generar productos de prueba", error);
        const customError = CustomError.createError({
            name: 'Error al generar productos de prueba',
            message: EErrors.UNKNOWN_ERROR.message,
            statusCode: EErrors.UNKNOWN_ERROR.statusCode
        });
        res.status(customError.statusCode).json({ error: customError.message });
    }
});

router.get('/addproduct', auth, isAdmin, async (req, res) => {
    res.render('addproduct', {
        style: 'index.css'
    });
});

router.get('/deleteproduct', auth, isAdmin, async (req, res) => {
    res.render('deleteproduct', {
        style: 'index.css'
    });
});

router.get('/chat', async (req,res) => {
    res.render('chat', {
        style: 'chat.css'
    });
})

router.get('/cart/:cid', auth, isUser, async (req, res) => {
    let cartId = req.params.cid;

    try {
        let cart = await CC.getById(cartId);
        if (!cart) {
            throw createError('CART_NOT_FOUND');
        }
        res.render('cart', {
            cart,
            style: '../../css/index.css'
        });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        const customError = createError(error.message || 'UNKNOWN_ERROR');
        res.status(customError.statusCode).json({ error: customError.message });
    }
});

router.get("/login", logged ,async (req, res) => {
    res.render(
        'login',
        {
            title: 'Login',
            style: 'user.css',
            loginFailed: req.session.loginFailed ?? false,
            loginSucess: req.session.registerSuccess ?? false
        }
    )
});

router.get("/register", (req, res) => {
    res.render(
        'register',
        {
            title: 'Registro',
            style: 'user.css',
            failRegister: req.session.failRegister ?? false,
            registerSuccess: req.session.registerSuccess ?? false
        }
    )
});

router.get("/notFound", (req, res) => {
    res.render(
        'notFound',
        {
            title: 'Not Found',
            style: 'index.css',
        }
    )
});

export default router;