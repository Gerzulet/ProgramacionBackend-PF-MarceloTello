import cartModel from "../dao/mongo/models/cartModel.js";
import userModel from "../dao/mongo/models/userModel.js";

import UserController from "../controllers/userController.js";
import CartController from "../controllers/cartController.js";

const UC = new UserController();
const CC = new CartController();

async function getCartId(req, res, next) {
    try {
        if (req.isAuthenticated()) { 
            const uid = req.user._id;
            const user = await UC.getById(uid);

            if (user && user.cartId) {
                req.cartId = user.cartId;
            } else {
                const newCart = await CC.create();
                user.cartId = newCart._id;
                await user.save();
                req.cartId = newCart._id;
            }
        } else {
            if (!req.cookies.cartId) {
                const newCart = await CC.create();
                res.cookie('cartId', newCart._id, { httpOnly: true, secure: true });
                req.cartId = newCart._id;
            } else {
                req.cartId = req.cookies.cartId;
            }
        }
        next();
    } catch (error) {
        console.error('Error al obtener el cartId', error);
        res.status(500).send('Error interno del servidor');
    }
}

export default getCartId;