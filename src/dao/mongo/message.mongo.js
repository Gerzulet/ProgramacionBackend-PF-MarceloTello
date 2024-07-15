import messageModel from './models/messageModel.js';

export default class MessageService {

    async add(user, message) {
        try {
            const newMessage = await messageModel.create({ user, message });
            console.log("Mensaje guardado correctamente");
            return newMessage;
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
            throw new Error("Error al guardar el mensaje");
        }
    }

    async getAll() {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error al obtener los mensajes:", error);
            throw new Error("Error al obtener los mensajes");
        }
    }
    
}

