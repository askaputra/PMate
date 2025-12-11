const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE (Penyimpanan Lokal Sementara) ---
// Data akan hilang jika server dimatikan.
let batches = [];
let orders = [];

// Counter ID manual (karena tidak ada database auto-increment)
let batchIdCounter = 1;
let orderIdCounter = 1;

// --- ROUTES ---

// 1. GET Dashboard Stats
app.get('/api/stats', (req, res) => {
  // Hitung total revenue dari array orders
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  
  res.json({
    total_batches: batches.length,
    total_orders: orders.length,
    total_revenue: totalRevenue
  });
});

// 2. GET All Batches
app.get('/api/batches', (req, res) => {
  // Urutkan batch terbaru di atas (reverse)
  const sortedBatches = [...batches].reverse(); 
  res.json(sortedBatches);
});

// 3. POST Create New Batch
app.post('/api/batches', (req, res) => {
  const { name } = req.body;
  
  const newBatch = {
    id: batchIdCounter++, // ID nambah sendiri
    name: name,
    status: 'OPEN',
    created_at: new Date()
  };
  
  batches.push(newBatch); // Simpan ke array
  res.json(newBatch);
});

// 4. GET Orders by Batch ID
app.get('/api/orders/:batchId', (req, res) => {
  const batchId = parseInt(req.params.batchId);
  // Filter array orders yang punya batchId sesuai
  const filteredOrders = orders.filter(o => o.batch_id === batchId);
  res.json(filteredOrders.reverse());
});

// 5. POST Create Order
app.post('/api/orders', (req, res) => {
  const { batch_id, customer_name, item_name, quantity, price_per_item } = req.body;
  
  const total_price = quantity * price_per_item; // Logic kalkulasi backend
  
  const newOrder = {
    id: orderIdCounter++, // ID nambah sendiri
    batch_id: parseInt(batch_id),
    customer_name,
    item_name,
    quantity: parseInt(quantity),
    price_per_item: parseInt(price_per_item),
    total_price: total_price,
    payment_status: 'UNPAID', // Default
    created_at: new Date()
  };

  orders.push(newOrder); // Simpan ke array
  res.json(newOrder);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} (Mode: No Database/Local Array)`);
});