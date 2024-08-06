import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Carts Router', () => {
    describe('Test de carritos', () => {
        it('El endpoint POST /api/carts debe crear un nuevo carrito', async() => {
            const { statusCode, body } = await requester.post('/api/carts');
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('_id');
        });

        it('El endpoint GET /api/carts/:cid debe obtener un carrito por ID', async() => {
            const cartId = 'ID_DEL_CARRITO';
            const { statusCode, body } = await requester.get(`/api/carts/${cartId}`);
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('_id').that.equals(cartId);
        });

        it('El endpoint POST /api/carts/:cid/product/:pid debe agregar un producto al carrito', async() => {
            const cartId = 'ID_DEL_CARRITO';
            const productId = 'ID_DEL_PRODUCTO';
            const { statusCode } = await requester.post(`/api/carts/${cartId}/product/${productId}`).send({ quantity: 2 });
            expect(statusCode).to.equal(200);
        });
    });
});
