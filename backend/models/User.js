const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'BUYER'],
        default: 'BUYER'
    },
    full_name: {
        type: String
    },
    phone_number: {
        type: String
    },
    address: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);
