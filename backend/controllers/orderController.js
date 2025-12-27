const orderService = require('../services/orderService');

const getOrders = async (req, res) => {
  try {
    const role = req.headers['x-user-role'];
    const username = req.headers['x-user-name'];
    const orders = await orderService.getOrders(role, username);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { product_id, quantity, customer_name, payment_method, shipping_option } = req.body;
    const newOrder = await orderService.createOrder(product_id, quantity, customer_name, payment_method, shipping_option);
    res.json(newOrder);
  } catch (error) {
    if (error.message === "Produk tidak ditemukan") {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const payOrder = async (req, res) => {
  try {
    const { payment_method, shipping_option } = req.body;
    const order = await orderService.payOrder(req.params.id, payment_method, shipping_option);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const remindOrder = async (req, res) => {
  try {
    const order = await orderService.remindOrder(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getOrders, createOrder, payOrder, remindOrder };