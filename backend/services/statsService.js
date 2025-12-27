const Product = require('../models/Product');
const Order = require('../models/Order');

const getStats = async () => {
  const total_products = await Product.countDocuments();
  const total_orders = await Order.countDocuments();

  const revenueAggregation = await Order.aggregate([
    { $match: { payment_status: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$total_price' } } }
  ]);
  const paid_revenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

  const pending_payment = await Order.countDocuments({ payment_status: 'UNPAID' });

  return {
    total_products,
    total_orders,
    paid_revenue,
    pending_payment
  };
};

module.exports = { getStats };