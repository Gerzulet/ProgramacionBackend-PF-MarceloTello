async function completePurchase() {
    try {
        const cartId = getCartIdURL();

        const user = typeof req !== 'undefined' && req.session && req.session.user;

        if (!user) {
            throw new Error('Usuario no encontrado. No se puede completar la compra.');
        }

        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail: user.email })
        });

        if (!response.ok) {
            throw new Error('Error al completar la compra');
        }

        const result = await response.json();
        console.log('Compra completada:', result);

        if (result.productsNotProcessed.length) {
            Swal.fire({
                icon: 'warning',
                title: 'Algunos productos no pudieron procesarse',
                text: `Debido a falta de stock: ${result.productsNotProcessed.join(', ')}`,
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Compra completada con éxito!',
                text: 'Gracias por tu compra.',
            }).then(() => {
                window.location.href = '/';
            });
        }

    } catch (error) {
        console.error('Error al completar la compra:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al completar la compra. Por favor, intenta nuevamente.',
        });
    }
}

function cancelPurchase() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Cancelarás la compra y regresarás al carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar compra',
        cancelButtonText: 'No, continuar comprando'
    }).then((result) => {
        if (result.isConfirmed) {
            const cartId = getCartIdURL1(); 
            window.location.href = `/cart/${cartId}`; 
        }
    });
}

// Función para obtener el ID del carrito desde la URL (último segmento de la URL)
function getCartIdURL() {
    const url = window.location.href;
    const parts = url.split('/');
    return parts[parts.length - 1];
}

// Función auxiliar para obtener el ID del carrito de otra manera si es necesario
function getCartIdURL1() {
    const url = window.location.href;
    const parts = url.split('/');
    const cartIdIndex = parts.indexOf('cart') + 1;
    return parts[cartIdIndex];
}
