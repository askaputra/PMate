const data = {
  users: [
    { id: 1, username: 'admin', password: '123', role: 'ADMIN' },
    { id: 2, username: 'buyer', password: '123', role: 'BUYER' }
  ],
  products: [],
  orders: [],
  counters: {
    userId: 3,
    productId: 1,
    orderId: 1
  }
};

module.exports = data;