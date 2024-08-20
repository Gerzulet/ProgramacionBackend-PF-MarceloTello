import express from 'express';
import __dirname from '../utils/utils.js';

import ProductController from '../controllers/productController.js';
import productModel from '../dao/mongo/models/productModel.js';
import CartController from '../controllers/cartController.js';
import UserController from '../controllers/userController.js';
import UserDTO from '../dao/DTOs/user.dto.js';
import { generateProducts } from '../utils/utilsmock.js';
import EErrors from '../services/errors/EErrors.js';
import CustomError from '../services/errors/CustomError.js';

import { auth, logged, isAdmin, isUser } from '../middlewares/auth.js'
import { generateProductErrorInfo } from '../services/errors/info.js';


const router = express.Router();

const PC = new ProductController();
const CC = new CartController();
const UC = new UserController();

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
            user: req.session.user,
            cartId: req.session.user.cartId
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get('/profile', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.render('profile', { 
                user: req.user,
                style: 'profile.css' 
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error al cargar el perfil del Usuario");
        res.status(500).send('Error del Servidor al cargar el perfil del usuario', error);
    }
});

router.get('/manageruser',auth, isAdmin, async (req,res) => {
    try{
        const users = await UC.getAll();
        if (users) {
            const usersDTO = users.map(user => new UserDTO(user));
            res.render('managerUsers', {
                users: usersDTO,
                style: 'managerUsers.css'
            });
        } else {
            res.status(404).json({ message: 'Usuarios no encontrados' });
        }
    } catch (error) {
        console.error("Error al cargar todos los usuarios")
        res.status(500).send('Error del Servidor al cargar los usuarios', error);
    }
})

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

router.get('/mockingproducts', auth, isAdmin, async (req, res) => {
    try {
        const products = generateProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al generar productos de prueba", error);
        const customError = CustomError.createError({
            name: 'Error al generar productos de prueba',
            message: EErrors.PRODUCT_MOCKS_ERROR.message,
            statusCode: EErrors.PRODUCT_MOCKS_ERROR.statusCode
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

router.get('/chat',auth, async (req,res) => {
    res.render('chat', {
        style: 'chat.css'
    });
})

router.get('/cart/:cid', async (req, res) => {
    let cartId = req.params.cid 
    try {
        let cart = await CC.getById(cartId);
        if (!cart) {
            return res.status(404).send('carrito no encontrado');
        }
        res.render('cart', {
            user: req.session.user,
            cart,
            style: '../../css/cart.css'
        });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json("No se pudo obtener el codigo , error del servidor");
    }
});

router.get('/cart/:cid/checkout', async (req, res) => {
    const cartId = req.params.cid;
    const user = req.session.user; 

    if (!user) {
        return res.redirect('/login'); 
    }

    try {
        let cart = await CC.getById(cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Calcula el subtotal de cada producto y el total general
        cart.products.forEach(product => {
            product.subtotal = product.quantity * product.product.price;
        });
        cart.total = cart.products.reduce((total, product) => total + product.subtotal, 0);

        res.render('checkout', { 
            cart,
            cartId,
            user: req.session.user,
            style: 'checkout.css'
        });
    } catch (error) {
        console.error('Error al cargar la vista de checkout:', error);
        res.status(500).send('Error al cargar la página de checkout');
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

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', {
        title: 'Forgot Password',
        style: 'forgot-password.css'
    });
});
  
router.get('/reset-password/:token', (req, res) => {
    res.render('reset-password', {
        title: 'Reset Password',
        style: 'reset-password.css',
        token: req.params.token
    });
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