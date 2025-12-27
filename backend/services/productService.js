const db = require('../data');

const getAllProducts = () => {
  return db.products;
};

const createProduct = (name, price, eta, description) => {
  const newProduct = {
    id: db.counters.productId++,
    name,
    price: parseInt(price),
    eta,
    description,
    created_at: new Date()
  };
  db.products.push(newProduct);
  return newProduct;
};

const deleteProduct = (id) => {
  const initialLength = db.products.length;
  // Memfilter array asli
  const filtered = db.products.filter(p => p.id !== parseInt(id));
  
  // Update reference array di db (karena in-memory, kita replace isinya)
  // Cara aman untuk in-memory object reference:
  db.products.length = 0; 
  db.products.push(...filtered);

  if (db.products.length === initialLength) {
     throw new Error("Produk tidak ditemukan atau gagal dihapus");
  }
  return { message: "Produk dihapus" };
};

module.exports = { getAllProducts, createProduct, deleteProduct };