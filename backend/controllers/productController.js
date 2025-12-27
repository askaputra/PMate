const productService = require('../services/productService');

const getAllProducts = (req, res) => {
  try {
    const products = productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = (req, res) => {
  try {
    const { name, price, eta, description } = req.body;
    const newProduct = productService.createProduct(name, price, eta, description);
    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = (req, res) => {
  try {
    const result = productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct };