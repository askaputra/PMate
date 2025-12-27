const mongoose = require('mongoose');
const Order = require('./models/Order');

mongoose.connect('mongodb://mongo:27017/pmate_db')
    .then(async () => {
        const result = await Order.updateMany({ payment_status: 'UNPAID' }, { billing_reminder: true });
        console.log('Updated:', result);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
