const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- DATABASE LOKAL (IN-MEMORY) ---
// Data disimpan di RAM, akan hilang jika server restart.
let batches = [];
let orders = [];

let batchIdCounter = 1;
let orderIdCounter = 1;

// --- ROUTES ---

// 1. GET Stats
app.get('/api/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  res.json({
    total_batches: batches.length,
    total_orders: orders.length,
    total_revenue: totalRevenue
  });
});

// 2. GET Batches
app.get('/api/batches', (req, res) => {
  res.json([...batches].reverse());
});

// 3. POST Batch
app.post('/api/batches', (req, res) => {
  const { name } = req.body;
  const newBatch = {
    id: batchIdCounter++,
    name: name,
    status: 'OPEN',
    created_at: new Date()
  };
  batches.push(newBatch);
  res.json(newBatch);
});

// 4. GET Orders by Batch
app.get('/api/orders/:batchId', (req, res) => {
  const batchId = parseInt(req.params.batchId);
  const filteredOrders = orders.filter(o => o.batch_id === batchId);
  res.json(filteredOrders.reverse());
});

// 5. POST Order
app.post('/api/orders', (req, res) => {
  const { batch_id, customer_name, item_name, quantity, price_per_item } = req.body;
  const total_price = quantity * price_per_item;
  
  const newOrder = {
    id: orderIdCounter++,
    batch_id: parseInt(batch_id),
    customer_name,
    item_name,
    quantity: parseInt(quantity),
    price_per_item: parseInt(price_per_item),
    total_price,
    payment_status: 'UNPAID',
    created_at: new Date()
  };
  orders.push(newOrder);
  res.json(newOrder);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} (Mode: Local In-Memory)`);
});