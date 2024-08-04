document.addEventListener('DOMContentLoaded', (req, res) => {
    let cartId = localStorage.getItem('cartId');
    

    if (!cartId) {
        async function createCart() {
            try {
                const response = await fetch(`/api/carts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    cartId = data._id;
                    localStorage.setItem('cartId', cartId);
                    console.log('Nuevo carrito creado:', cartId);
                } else {
                    console.error('Error al crear el carrito');
                }
            } catch (error) {
                console.error('Error al crear el carrito:', error);
            }
        }

        createCart();
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;

            async function addProductToCart() {
                try {
                    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ quantity: 1 })
                    });

                    if (response.ok) {
                        console.log('Producto agregado al carrito exitosamente');
                    } else {
                        console.error('Error al agregar el producto al carrito');
                    }
                } catch (error) {
                    console.error('Error al agregar producto al carrito:', error);
                }
            }

            addProductToCart();
        });
    });
});