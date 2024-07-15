const EErrors = {
    //Productos
    PRODUCT_NOT_FOUND: { message: 'Producto no encontrado', statusCode: 404 },
    PRODUCT_GET_ALL_FAILED: { message: 'Error al obtener todos los productos', statusCode: 500 },
    PRODUCT_GET_BY_ID_FAILED: { message: 'Error al obtener producto por ID', statusCode: 500 },
    PRODUCT_ADD_FAILED: { message: 'Error al agregar producto', statusCode: 500 },
    PRODUCT_UPDATE_FAILED: { message: 'Error al actualizar producto', statusCode: 500 },
    PRODUCT_DELETE_FAILED: { message: 'Error al eliminar producto', statusCode: 500 },
    //Usuarios
    USER_NOT_FOUND: { message: 'Usuario no encontrado', statusCode: 404 },
    USER_NOT_AUTHORIZED: { message: 'Usuario no autorizado', statusCode: 403 },
    USER_CREATE_FAILED: { message: 'Error al intentar crear el usuario', statusCode: 500 },
    USER_GET_ALL_FAILED: { message: 'Error al obtener todos los usuarios', statusCode: 500 },
    USER_GET_BY_ID_FAILED: { message: 'Error al obtener el usuario por ID', statusCode: 500 },
    MISSING_REQUIRED_FIELDS: { message: 'Falta alguno de los campos obligatorios', statusCode: 400 },
    PASSWORD_NOT_PROVIDED: { message: 'No se ha proporcionado un password', statusCode: 400 },
    USER_NOT_PROVIDED: { message: 'No se ha proporcionado un usuario', statusCode: 400 },
    INCORRECT_PASSWORD: { message: 'Contraseña incorrecta', statusCode: 401 },
    CREDENTIALS_INCORRECT: { message: 'Credenciales incorrectas', statusCode: 401 },
    //Mensajes
    MESSAGE_ADD_FAILED: { message: 'Error al agregar mensaje', statusCode: 500 },
    MESSAGE_GET_ALL_FAILED: { message: 'Error al obtener todos los mensajes', statusCode: 500 },    
    //Carrito
    CART_NOT_FOUND: { message: 'Carrito no encontrado', statusCode: 404 },
    CART_ADD_PRODUCT_FAILED: { message: 'Error al agregar producto al carrito', statusCode: 500 },
    CART_GET_ALL_FAILED: { message: 'Error al obtener todos los carritos', statusCode: 500 },
    CART_GET_BY_ID_FAILED: { message: 'Error al obtener el carrito por ID', statusCode: 500 },
    CART_REMOVE_ALL_PRODUCTS_FAILED: { message: 'Error al eliminar todos los productos del carrito', statusCode: 500 },
    CART_REMOVE_PRODUCT_FAILED: { message: 'Error al eliminar producto del carrito', statusCode: 500 },
    CART_UPDATE_FAILED: { message: 'Error al actualizar el carrito', statusCode: 500 },
    CART_UPDATE_QUANTITY_FAILED: { message: 'Error al actualizar la cantidad de un producto en el carrito', statusCode: 500 },
    PURCHASE_CART_FAILED: { message: 'Error al procesar la compra del carrito', statusCode: 500 },
    CART_DELETE_FAILED: { message: 'Error al eliminar el carrito', statusCode: 500 },
    NO_PRODUCTS_AVAILABLE: { message: 'No hay productos disponibles para procesar la compra', statusCode: 404 },
};

export default EErrors;