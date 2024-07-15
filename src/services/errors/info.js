export const generateUserErrorInfo = (user) => {
    return `Uno o más campos estaban incompletos o no válidos.
    Lista de campos requeridos:
    *first_name  : debe ser una cadena, recibido ${user.first_name}
    *last_name   : debe ser una cadena, recibido ${user.last_name}
    *email       : debe ser una cadena, recibido ${user.email}`;
}

export const generateCartErrorInfo = (cartInfo) => {
    return `Uno o más datos del carrito son incorrectos o faltantes.
    Detalles del carrito:
    *ID del producto: ${cartInfo.productId}
    *Cantidad: ${cartInfo.quantity}`;
}

export const generateProductErrorInfo = (product) => {
    return `Uno o más campos estaban incompletos o no válidos.
    Lista de campos requeridos:
    *title     : debe ser una cadena, recibido ${product.title}
    *code      : debe ser una cadena, recibido ${product.code}
    *category  : debe ser una cadena, recibido ${product.category}
    *price  : debe ser un numero, recibido ${product.price}`;
}