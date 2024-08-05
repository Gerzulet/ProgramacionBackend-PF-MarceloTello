import chai from 'chai' ;
import mongoose from 'mongoose';
import UserController from '../controllers/userController.js';
import UserService from '../dao/mongo/user.mongo.js';
import config from '../config.js';

const expect = chai.expect;

// MongoDB connect
mongoose.connect(config.mongo_url);
mongoose.connection.on('connected', () => {
    logger.info('Conectado a MongoDB');
});
mongoose.connection.on('error', (err) => {
    logger.error('Error de conexión a MongoDB:', err);
});

describe('Set de tests con Chai', () => {
    before(function() {
        this.UC = new UserController();
    })
    beforeEach(function () {
        mongoose.connection.collections.users.drop();
        this.timeout(5000);
    })
    it('El Controller debe poder obtener los usuarios en formato de arreglo', async function (){
        const result = await this.UC.getAll();
        expect(result).to.be.deep.equal([]);
        // expect(result).deep.equal([]);
        // expect(Array.isArray(result)).to.be.equals(true);
        // expect(Array.isArray(result)).to.be.ok
    })
})