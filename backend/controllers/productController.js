const productService = require('../services/productService');

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, eta, description } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      const protocol = req.protocol;
      const host = req.get('host');
      images = req.files.map(file => `${protocol}://${host}/uploads/${file.filename}`);
    } else if (req.body.image_url) {
      images = [req.body.image_url];
    }

    const newProduct = await productService.createProduct(name, price, eta, description, images);
    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, eta, description, existing_images } = req.body;
    let images;

    if (req.files && req.files.length > 0) {
      const protocol = req.protocol;
      const host = req.get('host');
      images = req.files.map(file => `${protocol}://${host}/uploads/${file.filename}`);
    } else if (existing_images) {
      try {
        images = JSON.parse(existing_images);
      } catch (e) {
        images = existing_images;
      }
    }

    const updated = await productService.updateProduct(req.params.id, {
      name,
      price: parseInt(price),
      eta,
      description,
      ...(images && { images })
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct };