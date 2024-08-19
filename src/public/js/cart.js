document.addEventListener('DOMContentLoaded', async () => {
    const cartId = getCartIdURL() ? getCartIdURL() : user.cartId;


    try {
        const response = await fetch(`/api/carts/${cartId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el carrito');
        }

        const cart = await response.json();
        let total = 0;

        console.log(cart);

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
});

async function updateQuantity(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const newQuantity = parseInt(quantityInput.value, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
        alert('Cantidad inválida');
        return;
    }

    try {
        const cartId = getCartIdURL();
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la cantidad del producto');
        }
        console.log('Cantidad del producto actualizada exitosamente');
        location.reload(); // Recargar la página para actualizar la vista del carrito
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
    }
}

async function removeProduct(productId) {
    try {
        const cartId = getCartIdURL();
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito');
        }
        console.log('Producto eliminado del carrito exitosamente');
        location.reload(); // Recargar la página para actualizar la vista del carrito
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
}

async function removeAllProducts() {
    try {
        const cartId = getCartIdURL();
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar todos los productos del carrito');
        }
        console.log('Todos los productos eliminados del carrito exitosamente');
        location.reload(); // Recargar la página para actualizar la vista del carrito
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
    }
}

function getCartIdURL() {
    const url = window.location.href;
    const parts = url.split('/');
    return parts[parts.length - 1]; // Devuelve la última parte de la URL, que debería ser el cartId
}
