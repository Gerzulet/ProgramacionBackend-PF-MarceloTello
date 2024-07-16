import ProductsService from '../dao/mongo/product.mongo.js';

export const auth = function (req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    return next();
}

export const logged = function (req, res, next) {
    if (req.session.user) {
        return res.redirect("/");
    }
    next();
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    }
    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export const isAdminOrOwner = async (req, res, next) => {
    const user = req.user;
    const productId = req.params.id;

    try {
        const product = await ProductsService.getById(productId);
        if (user.role === 'admin' || product.owner === user.email) {
            return next();
        } else {
            return res.status(403).json({ message: 'Acceso denegado: solo administradores o propietarios pueden realizar esta acción.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar permisos', error });
    }
};

export default { auth, logged, isAdmin, isUser, isPremium, isAdminOrOwner };