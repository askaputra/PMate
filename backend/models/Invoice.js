const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoice_no: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product_name: String,
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['UNPAID', 'PAID'],
        default: 'UNPAID'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

invoiceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
