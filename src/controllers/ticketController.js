import { TicketsService } from "../repository/index.js";
import { createError } from "../utils/errorHandler.js";

export default class TicketController {

    constructor() {
        this.ticketService = TicketsService;
    }

    async add(ticket) {
        const { code, purchase_datetime, amount, purchaser } = ticket;

        if (!code || !purchase_datetime || !amount || !purchaser) {
            throw createError('MISSING_REQUIRED_FIELDS');
        }

        try {
            return await this.ticketService.createTicket({ code, purchase_datetime, amount, purchaser });
        } catch (error) {
            throw createError('TICKET_ADD_FAILED');
        }
    }

    async getAll() {
        try {
            return await this.ticketService.getTickets();
        } catch (error) {
            throw createError('TICKET_GET_ALL_FAILED');
        }
    }

    async getByID(tid) {
        try {
            const ticket = await this.ticketService.getTicketById(tid);
            if (!ticket) {
                throw createError('TICKET_NOT_FOUND');
            }
            return ticket;
        } catch (error) {
            throw createError('TICKET_GET_BY_ID_FAILED');
        }
    }

    async update(tid, update) {
        if (!tid || !update) {
            throw createError('MISSING_REQUIRED_FIELDS');
        }
        try {
            return await this.ticketService.updateTicket(tid, update);
        } catch (error) {
            throw createError('TICKET_UPDATE_FAILED');
        }
    }

    async delete(tid) {
        try {
            return await this.ticketService.deleteTicket(tid);
        } catch (error) {
            throw createError('TICKET_DELETE_FAILED');
        }
    }
}