const db = require('../data');

const getOrders = (role, username) => {
  if (role === 'ADMIN') {
    return [...db.orders].reverse();
  } else {
    return db.orders.filter(o => o.customer_name === username).reverse();
  }
};

const createOrder = (productId, quantity, customerName) => {
  const product = db.products.find(p => p.id === parseInt(productId));
  
  if (!product) throw new Error("Produk tidak ditemukan");

  const total_price = product.price * parseInt(quantity);
  const newOrder = {
    id: db.counters.orderId++,
    product_id: product.id,
    product_name: product.name,
    product_eta: product.eta,
    customer_name: customerName,
    quantity: parseInt(quantity),
    price_per_item: product.price,
    total_price,
    payment_status: 'UNPAID',
    invoice_no: `INV/${new Date().getFullYear()}/${db.counters.orderId}`,
    created_at: new Date()
  };

  db.orders.push(newOrder);
  return newOrder;
};

const payOrder = (id) => {
  const order = db.orders.find(o => o.id === parseInt(id));
  if (!order) throw new Error("Order tidak ditemukan");
  
  order.payment_status = 'PAID';
  return order;
};

module.exports = { getOrders, createOrder, payOrder };