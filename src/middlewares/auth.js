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

export default {auth, logged, isAdmin, isUser};