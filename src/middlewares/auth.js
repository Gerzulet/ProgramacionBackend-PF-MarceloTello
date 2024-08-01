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
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    }
    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export const isPremium = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'premium') {
        return next();
    }
    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export const isAdminOrOwner = async (req, res, next) => {
    const user = req.session.user;
    const productId = req.params.id;

    try {
        const product = await ProductsService.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        if (user.role === 'admin' || product.owner === user.email) {
            return next();
        } else {
            return res.status(403).json({ message: 'Acceso denegado: solo administradores o propietarios pueden realizar esta acción.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar permisos', error });
    }
};

export const isAdminOrPremium = (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return res.status(403).send('No tienes permisos para realizar esta acción.');
    }

    if (user.role === 'admin' || user.role === 'premium') {
        return next();
    }

    return res.status(403).send('No tienes permisos para realizar esta acción.');
};

export default { auth, logged, isAdmin, isUser, isPremium, isAdminOrOwner, isAdminOrPremium };