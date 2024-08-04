document.addEventListener('DOMContentLoaded', async () => {
    const cartId = getCartIdURL();
    const cartContainer = document.querySelector('.container');

    try {
        const response = await fetch(`/api/carts/${cartId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el carrito');
        }

        const cart = await response.json();

        if (cart && cart.products.length > 0) {
            const productList = document.createElement('ul');
            cart.products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `${product.product.title}: ${product.quantity}`;

                // Botón para eliminar el producto
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Eliminar';
                removeButton.addEventListener('click', async () => {
                    await removeProductFromCart(product.product._id);
                    
                });
                listItem.appendChild(removeButton);

                productList.appendChild(listItem);
            });
            cartContainer.appendChild(productList);

            // Botón para eliminar todos los productos
            const removeAllButton = document.createElement('button');
            removeAllButton.textContent = 'Eliminar todos';
            removeAllButton.addEventListener('click', async () => {
                await removeAllProductsFromCart();
                
            });
            cartContainer.appendChild(removeAllButton);
        } else {
            const message = document.createElement('h2');
            message.textContent = 'No hay productos en el carrito';
            cartContainer.appendChild(message);
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
});

async function removeProductFromCart(productId) {
    try {
        const cartId = getCartIdURL();
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito');
        }
        console.log('Producto eliminado del carrito exitosamente');
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
}

async function removeAllProductsFromCart() {
    try {
        const cartId = getCartIdURL();
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar todos los productos del carrito');
        }
        console.log('Todos los productos eliminados del carrito exitosamente');
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
    }
}

function getCartIdURL() {
    const url = window.location.href;
    const parts = url.split('/');
    return parts[parts.length - 1]; // Devuelve la última parte de la URL, que debería ser el cartId
} 