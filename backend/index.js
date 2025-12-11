const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let products = [];
let orders = [];

let users = [
  { id: 1, username: 'admin', password: '123', role: 'ADMIN' },
  { id: 2, username: 'buyer', password: '123', role: 'BUYER' }
];

let productIdCounter = 1;
let orderIdCounter = 1;
let userIdCounter = 3; 

const checkAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'ADMIN') return res.status(403).json({ error: "Akses ditolak! Khusus Admin." });
  next();
};


//REGISTER
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Semua kolom wajib diisi!" });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: "Username sudah terpakai!" });
  }

  const newUser = {
    id: userIdCounter++,
    username,
    password, 
    role: role.toUpperCase() 
  };

  users.push(newUser);
  console.log(`User baru terdaftar: ${username} (${role})`);
  
  res.json({ message: "Registrasi berhasil, silakan login.", user: { username: newUser.username, role: newUser.role } });
});

//LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role 
    });
  } else {
    res.status(401).json({ error: "Username atau Password salah!" });
  }
});


//ROUTES PRODUCT & ORDERS

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', checkAdmin, (req, res) => {
  const { name, price, eta, description } = req.body;
  const newProduct = {
    id: productIdCounter++,
    name,
    price: parseInt(price),
    eta,
    description,
    created_at: new Date()
  };
  products.push(newProduct);
  res.json(newProduct);
});

app.delete('/api/products/:id', checkAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ message: "Produk dihapus" });
});

app.get('/api/orders', (req, res) => {
  const role = req.headers['x-user-role'];
  const username = req.headers['x-user-name'];

  if (role === 'ADMIN') {
    res.json(orders.reverse());
  } else {
    const myOrders = orders.filter(o => o.customer_name === username);
    res.json(myOrders.reverse());
  }
});

app.post('/api/orders', (req, res) => {
  const { product_id, quantity, customer_name } = req.body;
  const product = products.find(p => p.id === parseInt(product_id));
  
  if (!product) return res.status(404).json({ error: "Produk tidak ditemukan" });

  const total_price = product.price * parseInt(quantity);
  const newOrder = {
    id: orderIdCounter++,
    product_id: product.id,
    product_name: product.name,
    product_eta: product.eta,
    customer_name,
    quantity: parseInt(quantity),
    price_per_item: product.price,
    total_price,
    payment_status: 'UNPAID',
    invoice_no: `INV/${new Date().getFullYear()}/${orderIdCounter}`,
    created_at: new Date()
  };

  orders.push(newOrder);
  res.json(newOrder);
});

app.put('/api/orders/:id/pay', checkAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (order) {
    order.payment_status = 'PAID';
    res.json(order);
  } else {
    res.status(404).json({ error: "Order tidak ditemukan" });
  }
});

app.get('/api/stats', checkAdmin, (req, res) => {
  const totalRevenue = orders
    .filter(o => o.payment_status === 'PAID')
    .reduce((sum, o) => sum + o.total_price, 0);

  res.json({
    total_products: products.length,
    total_orders: orders.length,
    paid_revenue: totalRevenue,
    pending_payment: orders.filter(o => o.payment_status === 'UNPAID').length
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Auth running on port ${PORT}`);
});