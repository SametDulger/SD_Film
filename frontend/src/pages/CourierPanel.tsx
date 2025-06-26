import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

interface Order {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  orderDate: string;
  deliveryDate?: string;
  returnDate?: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  notes?: string;
  courierId?: number;
  orderDetails: OrderDetail[];
}

interface OrderDetail {
  id: number;
  filmId: number;
  filmTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const CourierPanel: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned');
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5028/api/orders/courier/${user?.id}`, config);
      const allOrders = response.data.data || [];
      setAssignedOrders(allOrders.filter((order: Order) => 
        order.status === 'Assigned' || order.status === 'InTransit'
      ));
      setCompletedOrders(allOrders.filter((order: Order) => 
        order.status === 'Delivered' || order.status === 'Returned'
      ));
    } catch (error) {
      setError('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await axios.put(`http://localhost:5028/api/orders/${orderId}/status`, status, config);
      fetchOrders();
    } catch (error) {
      setError('Durum güncellenirken bir hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return '#17a2b8';
      case 'InTransit': return '#007bff';
      case 'Delivered': return '#28a745';
      case 'Returned': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const renderAssignedOrders = () => (
    <div className="card">
      <h2>Atanan Siparişler</h2>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : assignedOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Henüz atanmış sipariş bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {assignedOrders.map(order => (
            <div key={order.id} className="card" style={{ border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Sipariş #{order.id}</h3>
                <span style={{ 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px', 
                  background: getStatusColor(order.status),
                  color: 'white'
                }}>
                  {order.status}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>Müşteri:</strong> {order.userName}
                </div>
                <div>
                  <strong>Telefon:</strong> {order.userPhone}
                </div>
                <div>
                  <strong>Adres:</strong> {order.deliveryAddress}
                </div>
                <div>
                  <strong>Tutar:</strong> {order.totalAmount} ₺
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Filmler:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {order.orderDetails.map(detail => (
                    <li key={detail.id}>
                      {detail.filmTitle} (x{detail.quantity})
                    </li>
                  ))}
                </ul>
              </div>

              {order.notes && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Notlar:</strong> {order.notes}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {order.status === 'Assigned' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdateStatus(order.id, 'InTransit')}
                  >
                    Teslimatı Başlat
                  </button>
                )}
                {order.status === 'InTransit' && (
                  <>
                    <button 
                      className="btn btn-success"
                      onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                    >
                      Teslim Edildi
                    </button>
                    <button 
                      className="btn btn-warning"
                      onClick={() => handleUpdateStatus(order.id, 'Returned')}
                    >
                      İade Edildi
                    </button>
                  </>
                )}
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.open(`tel:${order.userPhone}`)}
                >
                  Müşteriyi Ara
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`)}
                >
                  Haritada Göster
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCompletedOrders = () => (
    <div className="card">
      <h2>Teslimat Geçmişi</h2>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : completedOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Henüz tamamlanmış teslimat bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Sipariş ID</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Müşteri</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Teslimat Tarihi</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Durum</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Tutar</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>#{order.id}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{order.userName}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      background: getStatusColor(order.status),
                      color: 'white'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{order.totalAmount} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderRoutePlanning = () => (
    <div className="card">
      <h2>Rota Planlama</h2>
      {assignedOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Planlanacak teslimat bulunmuyor.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3>Bugünkü Teslimatlar ({assignedOrders.length})</h3>
            <p>Toplam Mesafe: ~{assignedOrders.length * 5} km</p>
            <p>Tahmini Süre: ~{assignedOrders.length * 15} dakika</p>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {assignedOrders.map((order, index) => (
              <div key={order.id} className="card" style={{ border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>#{index + 1} - Sipariş #{order.id}</strong>
                    <p style={{ margin: '0.5rem 0' }}>{order.userName}</p>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>{order.deliveryAddress}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0.5rem 0' }}>Tahmini: {15 + (index * 5)} dakika</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`)}
                    >
                      Haritada Göster
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStatistics = () => (
    <div className="card">
      <h2>İstatistikler</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ textAlign: 'center', background: '#e8f5e8' }}>
          <h3>Bugünkü Teslimatlar</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>{assignedOrders.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#fff3e0' }}>
          <h3>Tamamlanan</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00' }}>{completedOrders.filter(o => o.status === 'Delivered').length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#e3f2fd' }}>
          <h3>İade Edilen</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>{completedOrders.filter(o => o.status === 'Returned').length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#f3e5f5' }}>
          <h3>Toplam Kazanç</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7b1fa2' }}>
            {completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)} ₺
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="card">
        <h1>Kurye Paneli</h1>
        <p>Hoş geldin, {user?.firstName} {user?.lastName}!</p>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'assigned' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('assigned')}
          >
            Atanan Siparişler
          </button>
          <button 
            className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('completed')}
          >
            Teslimat Geçmişi
          </button>
          <button 
            className={`btn ${activeTab === 'route' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('route')}
          >
            Rota Planlama
          </button>
          <button 
            className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('stats')}
          >
            İstatistikler
          </button>
        </div>
      </div>

      {activeTab === 'assigned' && renderAssignedOrders()}
      {activeTab === 'completed' && renderCompletedOrders()}
      {activeTab === 'route' && renderRoutePlanning()}
      {activeTab === 'stats' && renderStatistics()}
    </div>
  );
};

export default CourierPanel; 
