const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    product_name: String,
    images: {
        type: [String],
        default: []
    },
    product_eta: String,
    quantity: {
        type: Number,
        required: true
    },
    price_per_item: Number,
    total_price: Number,
    payment_status: {
        type: String,
        enum: ['UNPAID', 'PAID'],
        default: 'UNPAID'
    },
    payment_method: String,
    shipping_option: String,
    invoice_no: String,
    billing_reminder: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Order', orderSchema);
