import __dirname from "./utils/utils.js";
import ProductController from "./controllers/productController.js";
import MessageController from "./controllers/messageController.js";

const PC = new ProductController();
const MC = new MessageController();

//Funcion para Actualizacion de Productos en tiempo real
const socketUpdatedProducts = async (socket) => {
    const products = await PC.getAll();
    socket.emit('productList',products);
    console.log("Productos Actualizados en tiempo real")
}

export default (io) => {

    let messages = [];

    io.on("connection", (socket) => {

        console.log("Nuevo cliente conectado")

        socketUpdatedProducts(socket);

        //socket escuchando lista de productos en tiempo real
        socket.on('messageProduct',data=>{
            console.log(data);
        })

        socket.on('messageChat', async (data) => {
            try {
                const newMessage = await MC.add(data.user, data.message);
                const messages = await MC.getAll();
                io.emit('messageLogs', messages);
            } catch (error) {
                console.error("Error al guardar el mensaje",error);
            }
        });
    })
}

