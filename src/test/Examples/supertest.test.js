import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Testing user',()=>{
    describe('Test de users', () => {
        it('El endpoint POST /api/sessions debe crear un usuario correctamente', async() => {
            const userMock = {
                first_name:"Gonzalo",
                last_name:"Torres",
                email:"prueba@gmail.com",
                age: 32,
                role: "admin",  
            }
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/sessions').send(userMock)
            console.log(statusCode);
            console.log(ok);
            console.log(_body);
            expect(_body.payload).to.have.property('_id');
        })
    })
})

describe('Test avanzado user', () => {
    let cookie;
    it('Debe registrar correctamente a un usuario', async function () {
        const userMock = {
            first_name:"Gonzalo",
            last_name:"Torres",
            email:"prueba@gmail.com",
            age: 32,
            role: "admin",
            password: "123"
        }
        const { _body } = await requester.post('/api/sessions/register').send(userMock);
        expect(_body.payload).to.be.ok;        
    })

    it('Debe loguear correctamente al usuario y devolver una cookie', async function () {
        const userMock = {
            email:"prueba@gmail.com",
            password: "123"
        }
        const result = await requester.post('/api/sessions/login').send(userMock);
        const cookieResult = result.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok;
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        expect(cookie.name).to.be.ok.and.eql('coderCookie');
        expect(cookie.value).to.be.ok;
    })

    it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async function () {
        const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(_body.payload.email).to.be.eql('prueba@gmail.com');        
    })
})

describe('Test image', () => {
    it('Debe poder crearse un product con al ruta de la imagen', async () => {
        const productMock = {
            title:"Porta vaso",
            code:"asd1234",
            description: "sin descripcion",
            category: "Espacio",
            price: 5000,
        }
        const result = await requester.post('/api/product/withimage')
        .field('title',productMock.title)
        .field('code',productMock.code)
        .field('description',productMock.description)
        .field('category',productMock.category)
        .field('price',productMock.price)
        //Falta setear bien esto para que funcion el test 
        .attach('image','.Ruta/image/')

        expect(result.status).to.be.eql(200);
        expect(result._body.payload).to.have.property('_id');
        expect(result._body.payload.image).to.be.ok;
    })

})