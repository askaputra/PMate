const Product = require('../models/Product');

const getAllProducts = async () => {
  return await Product.find().sort({ created_at: -1 });
};

const createProduct = async (name, price, eta, description, images) => {
  const newProduct = new Product({
    name,
    price: parseInt(price),
    eta,
    description,
    images
  });
  await newProduct.save();
  return newProduct;
};

const deleteProduct = async (id) => {
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    throw new Error("Produk tidak ditemukan atau gagal dihapus");
  }
  return { message: "Produk dihapus" };
};

const updateProduct = async (id, data) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!updatedProduct) throw new Error("Produk tidak ditemukan");
  return updatedProduct;
};

module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct };