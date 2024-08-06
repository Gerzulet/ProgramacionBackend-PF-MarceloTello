import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Sessions Router', () => {
    let cookie;

    it('Debe registrar correctamente a un usuario', async function () {
        const userMock = {
            first_name: "Gonzalo",
            last_name: "Torres",
            email: "prueba@gmail.com",
            age: 32,
            role: "admin",
            password: "123"
        };
        const { statusCode, body } = await requester.post('/api/sessions/register').send(userMock);
        expect(statusCode).to.equal(201);
        expect(body).to.be.ok;
    });

    it('Debe loguear correctamente al usuario y devolver una cookie', async function () {
        const userMock = {
            email: "prueba@gmail.com",
            password: "123"
        };
        const result = await requester.post('/api/sessions/login').send(userMock);
        const cookieResult = result.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        };
        expect(cookie.name).to.be.ok.and.eql('coderCookie');
        expect(cookie.value).to.be.ok;
    });

    it('Debe enviar la cookie que contiene el usuario y obtener el usuario actual', async function () {
        const { statusCode, body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.equal(200);
        expect(body.payload.email).to.be.eql('prueba@gmail.com');
    });
});
