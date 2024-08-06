import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Products Router', () => {
    describe('Test de productos', () => {
        it('El endpoint GET /api/products debe obtener todos los productos', async() => {
            const { statusCode, body } = await requester.get('/api/products');
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('array');
        });

        it('El endpoint GET /api/products/:id debe obtener un producto por ID', async() => {
            const productId = 'ID_DEL_PRODUCTO';
            const { statusCode, body } = await requester.get(`/api/products/${productId}`);
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('_id').that.equals(productId);
        });

        it('El endpoint POST /api/products debe crear un producto', async() => {
            const newProduct = {
                title: "Nuevo Producto",
                description: "Descripción del nuevo producto",
                price: 100,
                category: "Categoría",
                stock: 10
            };
            const { statusCode, body } = await requester.post('/api/products').send(newProduct);
            expect(statusCode).to.equal(201);
            expect(body).to.have.property('_id');
        });
    });
});