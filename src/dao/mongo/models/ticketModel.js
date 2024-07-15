import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketCollection = "ticket"

const ticketSchema = mongoose.Schema({

    code: {
        type: String,
        unique: true,
        default: function() {
            return `TICKET-${uuidv4()}`;
        }
    },
    purchase_datetime: { 
        type: Date, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    purchaser: { 
        type: String, 
        required: true 
    },

});

ticketSchema.pre('save', async function(next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            this.code = `TICKET-${uuidv4()}`;
            const existingTicket = await mongoose.models.Ticket.findOne({ code: this.code });
            if (!existingTicket) {
                isUnique = true;
            }
        }
    }
    next();
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel;