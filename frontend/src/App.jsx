import React, { useState, useEffect } from 'react';
import axios from 'axios';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({});

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const handleUpdateProfile = () => {
    api.put(`/auth/profile/${user.id}`, tempProfile)
      .then(res => {
        alert("Profil berhasil diperbarui!");
        setUser(res.data.user);
        setIsEditingProfile(false);
      })
      .catch(err => alert("Gagal update profil: " + err.message));
  };

  if (!user) {
    return <AuthPage onLoginSuccess={setUser} />;
  }

  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', padding: '0 20px 40px', maxWidth: '1100px', margin: '0 auto', color: '#111827', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: '#111827', margin: '0 -20px 40px', padding: '15px 40px', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontWeight: '700', letterSpacing: '-0.5px' }}>PreorderMate {user.role === 'ADMIN' && <span style={{ fontSize: '0.5em', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 8px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '10px', fontWeight: '500' }}>{user.role}</span>}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
          {user.role === 'BUYER' && (
            <button
              onClick={() => setShowProfile(!showProfile)}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
              title="Profile Details"
            >
              ☰
            </button>
          )}
          <span>Halo, <strong>{user.username}</strong></span>

          {showProfile && user.role === 'BUYER' && (
            <div style={{ position: 'absolute', top: '50px', right: 0, background: 'white', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 100, width: '280px', color: '#111827' }}>
              <div style={{ fontWeight: '800', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Profile Details</span>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setTempProfile({ full_name: user.full_name || '', phone_number: user.phone_number || '', address: user.address || '' });
                    }}
                    style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px', background: '#f3f4f6' }}
                  >
                    EDIT
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>Nama Lengkap</label>
                    <input type="text" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '12px' }}
                      value={tempProfile.full_name} onChange={e => setTempProfile({ ...tempProfile, full_name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>WhatsApp/HP</label>
                    <input type="text" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '12px' }}
                      value={tempProfile.phone_number} onChange={e => setTempProfile({ ...tempProfile, phone_number: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>Alamat</label>
                    <textarea style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '12px', height: '60px', fontFamily: 'inherit' }}
                      value={tempProfile.address} onChange={e => setTempProfile({ ...tempProfile, address: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={handleUpdateProfile} style={{ flex: 1, background: '#111827', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Save</button>
                    <button onClick={() => setIsEditingProfile(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div><div style={{ fontSize: '10px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>Full Name</div><div style={{ fontWeight: '600' }}>{user.full_name || user.username}</div></div>
                  <div><div style={{ fontSize: '10px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>WhatsApp/HP</div><div style={{ fontWeight: '600' }}>{user.phone_number || '-'}</div></div>
                  <div><div style={{ fontSize: '10px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>Address</div><div style={{ fontWeight: '600', lineHeight: '1.4' }}>{user.address || '-'}</div></div>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setUser(null)} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}>Logout</button>
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
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/register' : '/login';

    const payload = isRegistering
      ? { username, password, full_name: fullName, phone_number: phoneNumber, address }
      : { username, password };

    api.post(endpoint, payload)
      .then(res => {
        if (isRegistering) {
          alert("Registration Successful! Please Sign In.");
          setIsRegistering(false);
          setPassword('');
        } else {
          onLoginSuccess(res.data);
        }
      })
      .catch(err => setError(err.response?.data?.error || "An error occurred"));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fafb', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      <div style={{ width: '400px', border: '1px solid #e5e7eb', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', background: 'white' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#111827', fontWeight: '700', letterSpacing: '-1px' }}>
          {isRegistering ? 'Create Buyer Account' : 'Welcome To PreorderMate'}
        </h2>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Username</label>
            <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              value={username} onChange={e => setUsername(e.target.value)} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
            <input type="password" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {isRegistering && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nama Lengkap</label>
                <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>No. WhatsApp/HP</label>
                <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Alamat Lengkap</label>
                <textarea required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', height: '80px', fontFamily: 'inherit' }}
                  value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </>
          )}
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#111827', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#6b7280' }}>
          {isRegistering ? 'Already have an account? ' : 'Don\'t have an account? '}
          <span onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#111827', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>
            {isRegistering ? 'Login here' : 'Register here'}
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
  const [newProduct, setNewProduct] = useState({ name: '', price: '', eta: '', image_url: '', imageFiles: [] });
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const refreshData = () => {
    const headers = { 'x-user-role': user.role, 'x-user-name': user.username };
    api.get('/products').then(res => setProducts(res.data));
    api.get('/orders', { headers }).then(res => setOrders(res.data));
    api.get('/stats', { headers }).then(res => setStats(res.data));
  };
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const moveImage = (type, index, direction) => {
    const list = type === 'new' ? [...newProduct.imageFiles] : [...existingImages];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;

    [list[index], list[newIndex]] = [list[newIndex], list[index]];

    if (type === 'new') {
      setNewProduct({ ...newProduct, imageFiles: list });
    } else {
      setExistingImages(list);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('eta', newProduct.eta);

    if (newProduct.imageFiles.length > 0) {
      newProduct.imageFiles.forEach(file => {
        formData.append('images', file);
      });
    } else {
      formData.append('image_url', newProduct.image_url);
      if (editingId && existingImages.length > 0) {
        formData.append('existing_images', JSON.stringify(existingImages));
      }
    }

    const request = editingId
      ? api.put(`/products/${editingId}`, formData, { headers: { 'x-user-role': user.role, 'Content-Type': 'multipart/form-data' } })
      : api.post('/products', formData, { headers: { 'x-user-role': user.role, 'Content-Type': 'multipart/form-data' } });

    request.then(() => {
      setNewProduct({ name: '', price: '', eta: '', image_url: '', imageFiles: [] });
      setExistingImages([]);
      setEditingId(null);
      refreshData();
      alert(editingId ? "Product updated successfully!" : "Product created successfully!");
    })
      .catch(err => alert("Operation failed (" + (editingId ? "update" : "create") + "): " + err.message));
  };

  const resetForm = () => {
    setNewProduct({ name: '', price: '', eta: '', image_url: '', imageFiles: [] });
    setEditingId(null);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      eta: product.eta,
      image_url: product.image_url || '',
      imageFiles: []
    });
    setExistingImages(product.images || []);
  };

  const handleRemind = (id, customer) => {
    const headers = { 'x-user-role': user.role };
    api.put(`/orders/${id}/remind`, {}, { headers })
      .then(() => {
        alert(`Tagihan telah dikirim ulang ke ${customer}!`);
        refreshData();
      })
      .catch(err => alert("Gagal menagih: " + err.message));
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Hapus produk?')) api.delete(`/products/${id}`, { headers: { 'x-user-role': user.role } }).then(() => refreshData());
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Total Products" value={products.length} />
        <StatCard title="Active Orders" value={orders.length} />
        <StatCard title="Total Revenue" value={`Rp ${stats.paid_revenue || 0}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px', alignItems: 'start', marginBottom: '60px' }}>
        <div>
          <h3 style={{ marginBottom: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>{editingId ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleAddProduct} style={{ background: editingId ? '#fffbeb' : '#ffffff', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #f3f4f6' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Name</label>
              <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', marginTop: '5px' }} required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Contoh: Gundam RX-78" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (IDR)</label>
              <input type="number" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box', marginTop: '5px' }} required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="500000" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Gallery (Max 5)</label>
              <input type="file" multiple accept="image/*" onChange={e => {
                const files = Array.from(e.target.files).slice(0, 5);
                setNewProduct({ ...newProduct, imageFiles: files });
              }} style={{ width: '100%', fontSize: '12px' }} />

              {newProduct.imageFiles.length > 0 && (
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {newProduct.imageFiles.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '60px' }}>
                      <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
                        <button type="button" onClick={() => moveImage('new', idx, 'left')} disabled={idx === 0} style={{ padding: '2px 6px', fontSize: '12px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px' }}>←</button>
                        <button type="button" onClick={() => moveImage('new', idx, 'right')} disabled={idx === newProduct.imageFiles.length - 1} style={{ padding: '2px 6px', fontSize: '12px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px' }}>→</button>
                      </div>
                      {idx === 0 && <span style={{ position: 'absolute', top: '-5px', left: '-5px', background: '#059669', color: 'white', fontSize: '8px', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>MAIN</span>}
                    </div>
                  ))}
                </div>
              )}

              {!newProduct.imageFiles.length && (
                <>
                  {existingImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {existingImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '60px' }}>
                          <img src={img} alt="existing" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
                            <button type="button" onClick={() => moveImage('existing', idx, 'left')} disabled={idx === 0} style={{ padding: '2px 6px', fontSize: '12px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px' }}>←</button>
                            <button type="button" onClick={() => moveImage('existing', idx, 'right')} disabled={idx === existingImages.length - 1} style={{ padding: '2px 6px', fontSize: '12px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px' }}>→</button>
                          </div>
                          {idx === 0 && <span style={{ position: 'absolute', top: '-5px', left: '-5px', background: '#059669', color: 'white', fontSize: '8px', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>MAIN</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="text" placeholder="Atau masukkan URL Gambar" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '13px' }} />
                </>
              )}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>ETA (Tanggal Sampai)</label>
              <input style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required value={newProduct.eta} onChange={e => setNewProduct({ ...newProduct, eta: e.target.value })} placeholder="Contoh: 20 Januari 2026" />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: editingId ? '#d97706' : '#111827', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={{ padding: '12px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '25px', fontWeight: '800', letterSpacing: '-0.5px' }}>Order Monitoring</h3>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ padding: '15px 20px', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Buyer</th>
                  <th style={{ padding: '15px 20px', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Product</th>
                  <th style={{ padding: '15px 20px', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Method</th>
                  <th style={{ padding: '15px 20px', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Shipping</th>
                  <th style={{ padding: '15px 20px', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '15px 20px', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.2s' }}>
                    <td style={{ padding: '15px 20px' }}><strong>{o.customer_name}</strong></td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {o.images && o.images.length > 0 && <img src={o.images[0]} alt="img" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                        <div>
                          <div style={{ fontWeight: '600' }}>{o.product_name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>x{o.quantity}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                        {o.payment_method || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: (o.shipping_option === '-' || !o.shipping_option) ? 'italic' : 'normal' }}>
                        {(o.shipping_option === '-' || !o.shipping_option) ? 'Belum dipilih' : o.shipping_option}
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}><span style={{ color: o.payment_status === 'PAID' ? '#059669' : '#d97706', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>{o.payment_status}</span></td>
                    <td style={{ padding: '15px 20px' }}>
                      {o.payment_status === 'UNPAID' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button onClick={() => handleRemind(o.id, o.customer_name)} style={{ background: '#111827', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>INVOICE</button>
                          {o.billing_reminder && <span style={{ fontSize: '10px', color: '#d97706', fontWeight: '600' }}>Reminded</span>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div >

      <div>
        <h3 style={{ borderLeft: '4px solid #111827', paddingLeft: '15px', marginBottom: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>Active Products Inventory</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
              <img src={(p.images && p.images.length > 0) ? p.images[0] : p.image_url} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ fontWeight: '800', fontSize: '16px', color: '#111827', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ color: '#111827', fontWeight: '700', fontSize: '15px', marginBottom: '15px' }}>Rp {p.price.toLocaleString()}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(p)} style={{ flex: 1, color: '#111827', border: '1px solid #e5e7eb', background: '#f9fafb', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>EDIT PRODUCT</button>
                  <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#dc2626', border: '1px solid #fee2e2', background: '#fef2f2', borderRadius: '8px', padding: '10px 15px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>DEL</button>
                </div>
              </div>
            </div>
          ))}
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderQty, setOrderQty] = useState(1);

  const refreshData = () => {
    const headers = { 'x-user-role': user.role, 'x-user-name': user.username };
    api.get('/products').then(res => setProducts(res.data)).catch(err => console.log("BUYER_PRODUCTS_ERR", err));
    api.get('/orders', { headers }).then(res => setMyOrders(res.data)).catch(err => console.log("BUYER_ORDERS_ERR", err));
  };
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQty(1);
  };

  const confirmOrder = () => {
    if (!selectedProduct) return;

    const shipping = document.getElementById('new-order-shipping').value;
    const payment = document.getElementById('new-order-payment').value;

    api.post('/orders', {
      product_id: selectedProduct.id,
      quantity: orderQty,
      customer_name: user.username,
      shipping_option: shipping,
      payment_method: payment
    })
      .then(() => {
        alert("Pesanan dibuat! Silakan bayar di menu Invoice.");
        refreshData();
        setSelectedProduct(null);
      })
      .catch(err => alert("Gagal memesan: " + err.message));
  };

  const openPaymentModal = (order) => {
    setSelectedOrder(order);
  };

  const submitPayment = (shipping, payment) => {
    if (!selectedOrder) return;
    api.put(`/orders/${selectedOrder.id}/pay`, {
      shipping_option: shipping,
      payment_method: payment
    }, { headers: { 'x-user-role': user.role } })
      .then(() => {
        alert("Payment Successful!");
        refreshData();
        setSelectedOrder(null);
      })
      .catch(err => alert("Payment failed: " + err.message));
  };

  const billedOrders = myOrders.filter(o => o.billing_reminder && o.payment_status === 'UNPAID');

  return (
    <div>
      {billedOrders.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', padding: '20px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <h4 style={{ margin: 0, fontWeight: '700' }}>Billing Notifications</h4>
          </div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>You have <strong>{billedOrders.length}</strong> pending invoices. Please complete payment for the following items:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {billedOrders.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(146, 64, 14, 0.1)' }}>
                <span style={{ fontSize: '13px' }}><strong>{o.invoice_no}</strong> • {o.product_name}</span>
                <button
                  onClick={() => openPaymentModal(o)}
                  style={{ background: '#111827', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <h3 style={{ borderLeft: '4px solid #111827', paddingLeft: '15px', marginBottom: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>Preorder Catalog</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
        {products.map(p => (
          <ProductCard key={p.id} p={p} onOrder={openOrderModal} />
        ))}
      </div>

      <h3 style={{ borderLeft: '4px solid #059669', paddingLeft: '15px', marginBottom: '30px', marginTop: '60px', fontWeight: '800', letterSpacing: '-0.5px' }}>My Invoices</h3>
      {myOrders.length === 0 ? <div style={{ padding: '20px', background: '#f9f9f9', textAlign: 'center', color: '#888' }}>Belum ada pesanan aktif.</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {myOrders.map(o => (
            <InvoiceItem key={o.id} o={o} onPay={openPaymentModal} />
          ))}
        </div>
      )}

      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#007bff' }}>Buat Pesanan</h3>
            <p>Produk: <strong>{selectedProduct.name}</strong></p>
            <div style={{ margin: '20px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Jumlah:</label>
              <input type="number" min="1" value={orderQty} onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Pengiriman:</label>
              <select id="new-order-shipping" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="JNE Regular">JNE Regular (Rp 10.000)</option>
                <option value="JNT Express">JNT Express (Rp 12.000)</option>
                <option value="SiCepat REG">SiCepat REG (Rp 11.000)</option>
              </select>
            </div>
            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Metode Pembayaran:</label>
              <select id="new-order-payment" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="BCA Virtual Account">BCA Virtual Account</option>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
              </select>
            </div>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>Total: <strong>Rp {(selectedProduct.price * orderQty).toLocaleString()}</strong></div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
              <button onClick={confirmOrder} style={{ padding: '10px 20px', background: '#111827', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Pesanan</button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#28a745' }}>Bayar Tagihan</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>Invoice: {selectedOrder.invoice_no}</p>

            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#555' }}>Informasi Pengiriman:</div>
              <div>{user.full_name || user.username}</div>
              <div>{user.phone_number || '-'}</div>
              <div style={{ fontStyle: 'italic', marginTop: '4px' }}>{user.address || 'Alamat belum disetel'}</div>
            </div>

            <p>Total Tagihan: <strong style={{ fontSize: '20px', color: '#333' }}>Rp {selectedOrder.total_price.toLocaleString()}</strong></p>

            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Pengiriman:</label>
              <select id="shipping" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="JNE Regular">JNE Regular (Rp 10.000)</option>
                <option value="JNT Express">JNT Express (Rp 12.000)</option>
                <option value="SiCepat REG">SiCepat REG (Rp 11.000)</option>
              </select>
            </div>

            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Metode Pembayaran:</label>
              <select id="payment" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="BCA Virtual Account">BCA Virtual Account</option>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '12px 24px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', color: '#374151' }}>Cancel</button>
              <button onClick={() => {
                const shipping = document.getElementById('shipping').value;
                const payment = document.getElementById('payment').value;
                submitPayment(shipping, payment);
              }} style={{ padding: '12px 24px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ p, onOrder }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const images = p.images && p.images.length > 0 ? p.images : [p.image_url];

  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6', transition: 'all 0.3s ease' }}>
      <div style={{ position: 'relative' }}>
        <img src={images[activeImgIdx]} alt={p.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.9)', overflowX: 'auto', borderTop: '1px solid #f3f4f6', backdropFilter: 'blur(4px)' }}>
            {images.map((img, idx) => (
              <img key={idx} src={img} onClick={() => setActiveImgIdx(idx)} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: activeImgIdx === idx ? '2px solid #111827' : '1px solid #e5e7eb', transition: 'all 0.2s' }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: '700', color: '#111827' }}>{p.name}</h4>
        <div style={{ color: '#111827', fontWeight: '800', fontSize: '18px', marginBottom: '12px' }}>Rp {p.price.toLocaleString()}</div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', fontWeight: '700' }}>Arrival:</span> {p.eta}</div>
        <button onClick={() => onOrder(p)} style={{ width: '100%', background: '#111827', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Order Now</button>
      </div>
    </div>
  );
}

function InvoiceItem({ o, onPay }) {
  const images = o.images && o.images.length > 0 ? o.images : [o.product_image];

  return (
    <div style={{ border: '1px solid #e1e1e1', padding: '15px', borderRadius: '8px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: o.payment_status === 'PAID' ? '5px solid #28a745' : '5px solid #ffc107', position: 'relative', display: 'flex', gap: '15px' }}>
      {images[0] && <img src={images[0]} alt="img" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />}
      <div style={{ flex: 1 }}>
        <div style={{ position: 'absolute', top: '15px', right: '15px', fontWeight: 'bold', color: o.payment_status === 'PAID' ? '#28a745' : '#ffc107' }}>{o.payment_status}</div>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{o.invoice_no}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{o.product_name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px dashed #eee', paddingTop: '10px', fontSize: '13px' }}>
          <span>Qty: <strong>{o.quantity}</strong></span>
          <span>Total: <strong>Rp {o.total_price.toLocaleString()}</strong></span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#555' }}>
          {o.payment_method !== '-' && <div>via {o.payment_method}</div>}
          {o.shipping_option !== '-' && <div>{o.shipping_option}</div>}
        </div>
        {o.payment_status === 'UNPAID' && (
          <button onClick={() => onPay(o)} style={{ marginTop: '10px', background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            Bayar Sekarang
          </button>
        )}
        {o.payment_status === 'PAID' && (
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '10px', background: '#d4edda', padding: '5px', borderRadius: '4px', display: 'inline-block' }}>
            Estimasi Sampai: {o.product_eta}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', flex: 1, textAlign: 'center', border: '1px solid #f3f4f6' }}>
      <div style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{value}</div>
    </div>
  );
}

export default App;