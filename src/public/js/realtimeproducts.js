const socket = io();
socket.emit('messageProduct','Lista de Productos en tiempo real');

// Escucha por eventos de actualización de la lista de productos
socket.on('productList', productList => {
    // Renderizar los productos en la lista
    const productListContainer = document.querySelector('.productList');
    productListContainer.innerHTML = ''; // Limpiar la lista antes de actualizar

    productList.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.title} - ${product.description} - ${product.price}`;
        productListContainer.appendChild(listItem);
    });
    
    console.log('Lista de productos actualizada:', productList);
});