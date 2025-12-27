const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const upload = require('./config/uploadConfig');
const path = require('path');

const app = express();

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const statsController = require('./controllers/statsController');

app.use(cors());
app.use(express.json());

const checkAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'ADMIN') return res.status(403).json({ error: "Akses ditolak! Khusus Admin." });
  next();
};

//ROUTES

// 1. Auth Routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.put('/api/auth/profile/:id', authController.updateProfile);

// 2. Product Routes
app.get('/api/products', productController.getAllProducts);
app.post('/api/products', checkAdmin, upload.array('images', 5), productController.createProduct);
app.put('/api/products/:id', checkAdmin, upload.array('images', 5), productController.updateProduct);
app.delete('/api/products/:id', checkAdmin, productController.deleteProduct);

// 3. Order Routes
app.get('/api/orders', orderController.getOrders);
app.post('/api/orders', orderController.createOrder);
app.put('/api/orders/:id/pay', orderController.payOrder);
app.put('/api/orders/:id/remind', checkAdmin, orderController.remindOrder);

// 4. Stats Route
app.get('/api/stats', checkAdmin, statsController.getStats);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Service Integrated running on port ${PORT}`);
});