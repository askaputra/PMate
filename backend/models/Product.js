const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    eta: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true,
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Product', productSchema);
