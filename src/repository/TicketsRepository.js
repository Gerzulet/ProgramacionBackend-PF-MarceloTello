export default class TicketRepository {
    constructor (dao) {
        this.dao = dao;
    }
    
    async getTickets() {
        return await this.dao.getAll();
    }

    async getTicketByID(tid) {
        return await this.dao.getById(tid);
    }

    async createTicket(ticket) {
        return await this.dao.add(ticket);
    }

    async updateTicket(tid,update){
        return await this.dao.update(tid,update);
    }

    async deleteTicket(tid) {
        return await this.dao.delete(tid);
    }

}