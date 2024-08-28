
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';
import passwordResetRouter from './routes/email.router.js';
import __dirname from './utils/utils.js';
import initializePassport from './config/passport.config.js';
import config from './config.js';
import websocket from './websocket.js';
import errorHandler from './middlewares/errors/index.js';
import { addLogger } from './utils/logger.js';
import logger from './utils/logger.js';
import getCartId from './middlewares/cartauth.js';
import specs from './config/swagger.config.js'

import express from 'express';
import handlebars from 'express-handlebars';
import exphbs from 'express-handlebars'
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import swaggerUiExpress from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc';
import cluster from 'cluster';
import { cpus } from 'os';



const app = express();

// MongoDB connect
mongoose.connect(config.mongo_url);
mongoose.connection.on('connected', () => {
    logger.info('Conectado a MongoDB');
});
mongoose.connection.on('error', (err) => {
    logger.error('Error de conexión a MongoDB:', err);
});

const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        json: function (context) {
            return JSON.stringify(context);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 3000,
    }),
    secret: "asd3ssfggwu22",
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.use(getCartId);
app.use(errorHandler);

// Routers
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/sessions', usersRouter);
app.use('/api/password-reset', passwordResetRouter );
app.use('/api-docs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))


const PORT = config.port || 8081;
const httpServer = app.listen(PORT, () => {
    logger.info("Escuchando por el puerto 8080");
});

const io = new Server(httpServer);

websocket(io);

