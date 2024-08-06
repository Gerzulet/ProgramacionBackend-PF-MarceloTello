import mongoose from "mongoose";
import UserController from "../../controllers/userController.js";
import UserService from "../../dao/mongo/user.mongo.js";
import Assert from 'assert';
import config from "../../config.js";

// MongoDB connect
mongoose.connect(config.mongo_url);
mongoose.connection.on('connected', () => {
    logger.info('Conectado a MongoDB');
});
mongoose.connection.on('error', (err) => {
    logger.error('Error de conexión a MongoDB:', err);
});

describe('Testing Users Controller', ()=> {
    before(function () {
        this.UC = new UserController();
    })
    beforeEach(function () {
        this.timeout(5000);
    })
    it('El Controller debe poder obtener los Users',async function () {
        console.log(this.UC);
        const result = await this.UC.getAll();
        //Assert determina si el test pasa o no (Tiene que ser un array getAll)
        assert.strictEqual(Array.isArray(result),true);
    })
})