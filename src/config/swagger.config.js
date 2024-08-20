import swaggerJSDoc from 'swagger-jsdoc';
import __dirname from '../utils/utils.js';

const swaggerOptions = {
    definition:{
        openapi:'3.0.0',
        info:{
            title:"Ecommerce CoderHouse",
            description:"Ecommerce de un Estudio Musical",
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server'
            }
        ]
    },
    apis:[`${__dirname}../../docs/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);

export default specs;

