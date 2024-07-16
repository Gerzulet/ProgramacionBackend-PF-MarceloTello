import winston from "winston";
import config from "../config.js"; 

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green'
    }
};

const developmentLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "debug",
        }),
    ]
});

const productionLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
        }),
    ]
});

const logger = config.env === 'production' ? productionLogger : developmentLogger;

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

export default logger;