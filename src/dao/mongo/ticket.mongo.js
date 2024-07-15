import ticketModel from './models/ticketModel.js';

class TicketService {

    async add(ticket) {
        const result = await ticketModel.create(ticket);
        return result;
    }

    async getAll() {
        try {
            let response = await ticketModel.find().explain('executionStats');
            console.log(response)
            
            return await ticketModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los productos")
        }
    }

    async getById(tid) {
        try {
            const ticket = await ticketModel.findOne({_id: tid});

            if (!ticket) throw new Error(`El ticket ${tid} no existe`)

            return ticket;
        } catch (e) {
            console.error(error.message);
            throw new Error("Error al obtener el ticket")
        }
        
    }

    async update(tid,update) {
        try{
            const result = await ticketModel.updateOne({_id: tid}, update);

            return result;
        } catch (error) {
            console.error("Error al actualizar el ticket:", error);
        }

    }

    async delete(tid) {
        try {
            const result = await ticketModel.deleteOne({_id: tid});
                   
            console.log("Ticket eliminado correctamente");
            if (result.deletedCount === 0) throw new Error(`El ticket ${tid} no existe`)
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al eliminar el ticket ${tid}`)
        }
    }

}

export default TicketService;