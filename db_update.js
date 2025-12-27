const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/pmate_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const Order = mongoose.model('Order', new mongoose.Schema({ customer_name: String, payment_status: String, billing_reminder: Boolean }));
        const result = await Order.updateMany({ payment_status: 'UNPAID' }, { billing_reminder: true });
        console.log('Update Result:', result);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
