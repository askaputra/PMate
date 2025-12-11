import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Memanggil API backend (pastikan backend jalan di port 3000)
    axios.get('http://localhost:3000/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Gagal konek backend:", err))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>🚀 PreorderMate Frontend</h1>
      <p>Status: {stats ? "Terhubung ke Backend" : "Menghubungkan..."}</p>
      
      {stats && (
        <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <h3>Statistik Toko:</h3>
          <p>📦 Total Batch: {stats.total_batches}</p>
          <p>📝 Total Order: {stats.total_orders}</p>
          <p>💰 Total Revenue: Rp {stats.total_revenue}</p>
        </div>
      )}
    </div>
  )
}

export default App