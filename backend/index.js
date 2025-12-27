const express = require('express');
const cors = require('cors');
const app = express();

// Import Controller
const authController = require('./controllers/authController'); // Anda perlu buat ini juga
const productController = require('./controllers/productController'); // Dan ini
const orderController = require('./controllers/orderController');

app.use(cors());
app.use(express.json());

// Middleware Check Admin (Tetap atau bisa dipindah ke utils)
const checkAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'ADMIN') return res.status(403).json({ error: "Akses ditolak! Khusus Admin." });
  next();
};

// --- ROUTES ---

// Auth Routes (Hubungkan ke authController)
// app.post('/api/register', authController.register);
// app.post('/api/login', authController.login);

// Product Routes (Hubungkan ke productController)
// app.get('/api/products', productController.getAllProducts);
// app.post('/api/products', checkAdmin, productController.createProduct);
// app.delete('/api/products/:id', checkAdmin, productController.deleteProduct);

// Order Routes (Yang sudah kita buat contohnya di atas)
app.get('/api/orders', orderController.getOrders);
app.post('/api/orders', orderController.createOrder);
app.put('/api/orders/:id/pay', checkAdmin, orderController.payOrder);

// Stats Route
// app.get('/api/stats', checkAdmin, orderController.getStats);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Service Integrated running on port ${PORT}`);
});