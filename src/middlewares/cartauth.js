import cartModel from "../dao/mongo/models/cartModel.js";
import userModel from "../dao/mongo/models/userModel.js";

async function getCartId(req, res, next) {
    try {
        if (req.isAuthenticated()) { 
            const user = await userModel.findById(req.user._id);
            if (user && user.cartId) {
                req.cartId = user.cartId;
            } else {
                const newCart = await cartModel.create({ products: [] });
                user.cartId = newCart._id;
                await user.save();
                req.user.cartId = newCart._id;
            }
        } else {
            if (!req.cookies.cartId) {
                const newCart = await cartModel.create({ products: [] });
                res.cookie('cartId', newCart._id, { httpOnly: true, secure: true });
            }
        }
        next();
    } catch (error) {
        console.error('Error al obtener el cartId', error);
        res.status(500).send('Error interno del servidor');
    }
}

export default getCartId;