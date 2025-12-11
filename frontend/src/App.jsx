import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <AuthPage onLoginSuccess={setUser} />;
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#333' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h2 style={{margin: 0}}>PreorderMate <span style={{fontSize: '0.6em', background: user.role === 'ADMIN' ? '#007bff' : '#28a745', color: 'white', padding: '3px 8px', borderRadius: '4px', verticalAlign: 'middle'}}>{user.role}</span></h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span>Halo, <strong>{user.username}</strong></span>
            <button onClick={() => setUser(null)} style={{background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Logout</button>
        </div>
      </header>

      {user.role === 'ADMIN' ? <AdminDashboard user={user} /> : <BuyerDashboard user={user} />}
    </div>
  );
}

function AuthPage({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/register' : '/login';
    
    const payload = { username, password };

    api.post(endpoint, payload)
       .then(res => {
           if(isRegistering) {
               alert("Registrasi Berhasil! Silakan Login.");
               setIsRegistering(false); 
               setPassword('');
           } else {
               onLoginSuccess(res.data);
           }
       })
       .catch(err => setError(err.response?.data?.error || "Terjadi Kesalahan"));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ width: '350px', border: '1px solid #e1e1e1', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', background: 'white' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
            {isRegistering ? 'Daftar Buyer Baru' : 'Login Sistem'}
        </h2>
        
        {error && <div style={{background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '15px'}}>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Username</label>
                <input type="text" required style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box'}} 
                       value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            
            <div style={{marginBottom: '20px'}}>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Password</label>
                <input type="password" required style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box'}} 
                       value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" style={{width: '100%', padding: '12px', background: isRegistering ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginTop: '5px'}}>
                {isRegistering ? 'Daftar Sekarang' : 'Masuk'}
            </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666'}}>
            {isRegistering ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <span onClick={() => setIsRegistering(!isRegistering)} style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold'}}>
                {isRegistering ? 'Login disini' : 'Daftar disini'}
            </span>
        </p>
      </div>
    </div>
  );
}

// DASHBOARD ADMIN
function AdminDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [newProduct, setNewProduct] = useState({ name: '', price: '', eta: '' });

  const refreshData = () => {
    const headers = { 'x-user-role': user.role, 'x-user-name': user.username };
    api.get('/products').then(res => setProducts(res.data));
    api.get('/orders', { headers }).then(res => setOrders(res.data));
    api.get('/stats', { headers }).then(res => setStats(res.data));
  };
  useEffect(() => { refreshData(); }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    api.post('/products', newProduct, { headers: { 'x-user-role': user.role } })
      .then(() => { setNewProduct({ name: '', price: '', eta: '' }); refreshData(); alert("Produk ditambahkan!"); });
  };

  const markAsPaid = (id) => {
    api.put(`/orders/${id}/pay`, {}, { headers: { 'x-user-role': user.role } }).then(() => refreshData());
  };

  const handleDeleteProduct = (id) => {
      if(confirm('Hapus produk?')) api.delete(`/products/${id}`, { headers: { 'x-user-role': user.role } }).then(() => refreshData());
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Total Produk" value={products.length} />
        <StatCard title="Total Pesanan" value={orders.length} />
        <StatCard title="Revenue (Lunas)" value={`Rp ${stats.paid_revenue || 0}`} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
        <div>
          <h3>Input Produk Baru</h3>
          <form onSubmit={handleAddProduct} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
            <div style={{marginBottom: '10px'}}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#555'}}>Nama Barang</label>
                <input style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing:'border-box'}} required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Contoh: Gundam RX-78" />
            </div>
            <div style={{marginBottom: '10px'}}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#555'}}>Harga (Rp)</label>
                <input type="number" style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing:'border-box'}} required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="500000" />
            </div>
            <div style={{marginBottom: '15px'}}>
                <label style={{fontSize: '12px', fontWeight: 'bold', color: '#555'}}>ETA (Tanggal Sampai)</label>
                <input style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing:'border-box'}} required value={newProduct.eta} onChange={e => setNewProduct({...newProduct, eta: e.target.value})} placeholder="Contoh: 20 Januari 2026" />
            </div>
            <button type="submit" style={{width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Tambah Produk</button>
          </form>
          
          <h4>List Produk Aktif:</h4>
          <ul style={{listStyle: 'none', padding: 0}}>
            {products.map(p => (
                <li key={p.id} style={{borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div><div style={{fontWeight: 'bold'}}>{p.name}</div> <small style={{color: '#666'}}>Rp {p.price.toLocaleString()}</small></div>
                    <button onClick={() => handleDeleteProduct(p.id)} style={{color: '#dc3545', border: '1px solid #dc3545', background: 'white', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px'}}>Hapus</button>
                </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3>Monitoring Pesanan</h3>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f1f3f5', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}><th style={{padding:'10px'}}>Buyer</th><th style={{padding:'10px'}}>Barang</th><th style={{padding:'10px'}}>Status</th><th style={{padding:'10px'}}>Aksi</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{padding:'10px'}}><strong>{o.customer_name}</strong></td>
                  <td style={{padding:'10px'}}>{o.product_name} <br/> <span style={{fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px'}}>x{o.quantity}</span></td>
                  <td style={{padding:'10px'}}><span style={{color: o.payment_status === 'PAID' ? '#28a745' : '#dc3545', fontWeight: 'bold', fontSize: '12px'}}>{o.payment_status}</span></td>
                  <td style={{padding:'10px'}}>
                    {o.payment_status === 'UNPAID' && <button onClick={() => markAsPaid(o.id)} style={{background:'#28a745', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontSize: '12px'}}>Terima Uang</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

//DASHBOARD BUYER
function BuyerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(1);

  const refreshData = () => {
    const headers = { 'x-user-role': user.role, 'x-user-name': user.username };
    api.get('/products').then(res => setProducts(res.data));
    api.get('/orders', { headers }).then(res => setMyOrders(res.data));
  };
  useEffect(() => { refreshData(); }, []);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQty(1);
  };

  const confirmOrder = () => {
    if (!selectedProduct) return;
    
    api.post('/orders', { product_id: selectedProduct.id, quantity: orderQty, customer_name: user.username })
        .then(() => { 
            alert("Pesanan berhasil dibuat! Cek invoice di bawah."); 
            refreshData(); 
            setSelectedProduct(null);
        })
        .catch(err => alert("Gagal memesan: " + err.message));
  };

  return (
    <div>
        <h3 style={{borderLeft: '5px solid #007bff', paddingLeft: '10px', marginBottom: '20px'}}>Katalog Preorder</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            {products.map(p => (
                <div key={p.id} style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', background: 'white', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h4 style={{margin: '0 0 10px 0', fontSize: '18px', color: '#333'}}>{p.name}</h4>
                        <p style={{color: '#666', fontSize: '13px', margin: '0 0 15px 0', background: '#f8f9fa', padding: '5px', borderRadius: '4px', display: 'inline-block'}}>
                            ETA: {p.eta}
                        </p>
                        <h3 style={{margin: '0 0 20px 0', color: '#007bff'}}>Rp {p.price.toLocaleString()}</h3>
                    </div>
                    
                    <button 
                        onClick={() => openOrderModal(p)} 
                        style={{width: '100%', background: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s'}}
                    >
                        Pesan Sekarang
                    </button>
                </div>
            ))}
        </div>

        <h3 style={{borderLeft: '5px solid #28a745', paddingLeft: '10px', marginBottom: '20px'}}>Invoice Saya</h3>
        {myOrders.length === 0 ? <div style={{padding: '20px', background: '#f9f9f9', textAlign: 'center', color: '#888'}}>Belum ada pesanan aktif.</div> : (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                {myOrders.map(o => (
                    <div key={o.id} style={{border:'1px solid #e1e1e1', padding:'15px', borderRadius:'8px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: o.payment_status==='PAID'?'5px solid #28a745':'5px solid #ffc107', position: 'relative'}}>
                        <div style={{position: 'absolute', top: '15px', right: '15px', fontWeight: 'bold', color: o.payment_status==='PAID'?'#28a745':'#ffc107'}}>{o.payment_status}</div>
                        <div style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>{o.invoice_no}</div>
                        <div style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '5px'}}>{o.product_name}</div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px dashed #eee', paddingTop: '10px'}}>
                            <span>Jumlah: <strong>{o.quantity}</strong> pcs</span>
                            <span>Total: <strong>Rp {o.total_price.toLocaleString()}</strong></span>
                        </div>
                        <div style={{fontSize: '12px', color: '#007bff', marginTop: '10px', background: '#e7f1ff', padding: '5px', borderRadius: '4px', display: 'inline-block'}}>
                            Estimasi Sampai: {o.product_eta}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {selectedProduct && (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                <div style={{background: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}}>
                    <h3 style={{marginTop: 0, color: '#007bff'}}>Konfirmasi Pesanan</h3>
                    <p>Anda akan memesan <strong>{selectedProduct.name}</strong></p>
                    <p style={{fontSize: '14px', color: '#555'}}>Harga Satuan: Rp {selectedProduct.price.toLocaleString()}</p>
                    
                    <div style={{margin: '20px 0'}}>
                        <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Masukkan Jumlah:</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={orderQty} 
                            onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', boxSizing:'border-box'}}
                        />
                    </div>

                    <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'right'}}>
                        Total Tagihan: <strong style={{fontSize: '18px', color: '#333'}}>Rp {(selectedProduct.price * orderQty).toLocaleString()}</strong>
                    </div>

                    <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                        <button onClick={() => setSelectedProduct(null)} style={{padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Batal</button>
                        <button onClick={confirmOrder} style={{padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Konfirmasi</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

function StatCard({ title, value }) {
    return <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flex: 1, textAlign: 'center', border: '1px solid #eee' }}><div style={{color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>{title}</div><h3 style={{fontSize: '28px', margin: '10px 0', color: '#333'}}>{value}</h3></div>;
}

export default App;