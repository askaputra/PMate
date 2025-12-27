const Order = require('../models/Order');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

const getOrders = async (role, username) => {
  console.log(`[GET ORDERS] Role: ${role}, User: ${username}`);
  if (role === 'ADMIN') {
    return await Order.find().sort({ created_at: -1 });
  } else {
    return await Order.find({
      customer_name: { $regex: new RegExp("^" + username + "$", "i") }
    }).sort({ created_at: -1 });
  }
};

const createOrder = async (productId, quantity, customerName, paymentMethod, shippingOption) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Produk tidak ditemukan");

  const total_price = product.price * parseInt(quantity);

  const userInvoiceCount = await Invoice.countDocuments({ username: customerName });
  const sequence = (userInvoiceCount + 1).toString().padStart(3, '0');
  const invoice_no = `INV/${customerName.toUpperCase()}/${sequence}`;

  const newOrder = new Order({
    product_id: product.id,
    product_name: product.name,
    images: product.images,
    product_eta: product.eta,
    customer_name: customerName,
    quantity: parseInt(quantity),
    price_per_item: product.price,
    total_price,
    payment_status: paymentMethod ? 'PAID' : 'UNPAID',
    payment_method: paymentMethod || '-',
    shipping_option: shippingOption || '-',
    invoice_no
  });
  await newOrder.save();

  const newInvoice = new Invoice({
    invoice_no,
    username: customerName,
    order_id: newOrder._id,
    product_name: product.name,
    amount: total_price,
    status: paymentMethod ? 'PAID' : 'UNPAID'
  });
  await newInvoice.save();

  return newOrder;
};

const payOrder = async (id, paymentMethod, shippingOption) => {
  const order = await Order.findById(id);
  if (!order) throw new Error("Order tidak ditemukan");

  order.payment_status = 'PAID';
  if (paymentMethod) order.payment_method = paymentMethod;
  if (shippingOption) order.shipping_option = shippingOption;

  await order.save();

  await Invoice.findOneAndUpdate(
    { invoice_no: order.invoice_no },
    { status: 'PAID' }
  );

  return order;
};

const remindOrder = async (id) => {
  console.log(`[REMIND ORDER] ID: ${id}`);
  const order = await Order.findById(id);
  if (!order) throw new Error("Order tidak ditemukan");
  order.billing_reminder = true;
  await order.save();
  console.log(`[REMIND ORDER] Success for Order ID: ${id}`);
  return order;
};

module.exports = { getOrders, createOrder, payOrder, remindOrder };