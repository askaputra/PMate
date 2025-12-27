const orderService = require('../services/orderService');

const getOrders = (req, res) => {
  try {
    const role = req.headers['x-user-role'];
    const username = req.headers['x-user-name'];
    const orders = orderService.getOrders(role, username);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = (req, res) => {
  try {
    const { product_id, quantity, customer_name } = req.body;
    const newOrder = orderService.createOrder(product_id, quantity, customer_name);
    res.json(newOrder);
  } catch (error) {
    if (error.message === "Produk tidak ditemukan") {
        return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const payOrder = (req, res) => {
  try {
    const order = orderService.payOrder(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getOrders, createOrder, payOrder };