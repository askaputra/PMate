const db = require('../data');

const getStats = () => {
  const totalRevenue = db.orders
    .filter(o => o.payment_status === 'PAID')
    .reduce((sum, o) => sum + o.total_price, 0);

  return {
    total_products: db.products.length,
    total_orders: db.orders.length,
    paid_revenue: totalRevenue,
    pending_payment: db.orders.filter(o => o.payment_status === 'UNPAID').length
  };
};

module.exports = { getStats };