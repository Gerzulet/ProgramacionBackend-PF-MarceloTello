import { Faker, es } from '@faker-js/faker';


const faker = new Faker({ locale: es });

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.datatype.uuid(),
        price: faker.commerce.price(),
        stock: faker.datatype.number({ min: 1, max: 20 }),
        category: faker.commerce.department(),
        thumbnails: [faker.image.imageUrl()]
    };
};

export const generateProducts = (num = 100) => {
    let products = [];
    for (let i = 0; i < num; i++) {
        products.push(generateProduct());
    }
    return products;
};