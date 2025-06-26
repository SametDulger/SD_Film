import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  deliveryDate?: string;
  returnDate?: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  notes?: string;
  courierId?: number;
  courierName?: string;
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone?: string;
  address?: string;
}

const CoordinatorPanel: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [couriers, setCouriers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<User | null>(null);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/orders', config);
      setOrders(response.data.data || []);
    } catch (error) {
      setError('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCouriers = async () => {
    try {
      const response = await axios.get('http://localhost:5028/api/users/role/Courier', config);
      setCouriers(response.data.data || []);
    } catch (error) {
      setError('Kuryeler yüklenirken bir hata oluştu');
    }
  };

  const handleAssignCourier = async (orderId: number, courierId: number) => {
    try {
      await axios.post(`http://localhost:5028/api/orders/${orderId}/assign-courier/${courierId}`, {}, config);
      fetchOrders();
    } catch (error) {
      setError('Kurye ataması yapılırken bir hata oluştu');
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

  const handleShowCourierDetails = (courier: User) => {
    setSelectedCourier(courier);
    setShowCourierModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'Assigned': return '#17a2b8';
      case 'InTransit': return '#007bff';
      case 'Delivered': return '#28a745';
      case 'Returned': return '#6c757d';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderOrders = () => (
    <div className="card">
      <h2>Sipariş Yönetimi</h2>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Sipariş ID</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Müşteri</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Tarih</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Tutar</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Durum</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Kurye</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>#{order.id}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{order.userName}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{order.totalAmount} ₺</td>
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
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {order.courierName || 'Atanmamış'}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {order.status === 'Pending' && (
                      <select 
                        onChange={(e) => handleAssignCourier(order.id, parseInt(e.target.value))}
                        style={{ marginRight: '0.5rem', padding: '0.2rem' }}
                      >
                        <option value="">Kurye Seç</option>
                        {couriers.map(courier => (
                          <option key={courier.id} value={courier.id}>
                            {courier.firstName} {courier.lastName}
                          </option>
                        ))}
                      </select>
                    )}
                    <select 
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      style={{ padding: '0.2rem' }}
                    >
                      <option value={order.status}>{order.status}</option>
                      {order.status === 'Pending' && <option value="Assigned">Assigned</option>}
                      {order.status === 'Assigned' && <option value="InTransit">InTransit</option>}
                      {order.status === 'InTransit' && <option value="Delivered">Delivered</option>}
                      {order.status === 'Delivered' && <option value="Returned">Returned</option>}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDeliveryPlanning = () => (
    <div className="card">
      <h2>Teslimat Planlama</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card">
          <h3>Bugünkü Teslimatlar</h3>
          <p>Toplam: {orders.filter(o => o.status === 'InTransit').length}</p>
          <p>Tamamlanan: {orders.filter(o => o.status === 'Delivered').length}</p>
          <p>Bekleyen: {orders.filter(o => o.status === 'Pending').length}</p>
        </div>
        <div className="card">
          <h3>Kurye Durumu</h3>
          {couriers.map(courier => (
            <div key={courier.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{courier.firstName} {courier.lastName}</strong>
              <p>Atanan Sipariş: {orders.filter(o => o.courierId === courier.id).length}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourierManagement = () => (
    <div className="card">
      <h2>Kurye Yönetimi</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {couriers.map(courier => (
          <div key={courier.id} className="card">
            <h3>{courier.firstName} {courier.lastName}</h3>
            <p>Atanan Siparişler: {orders.filter(o => o.courierId === courier.id).length}</p>
            <p>Tamamlanan: {orders.filter(o => o.courierId === courier.id && o.status === 'Delivered').length}</p>
            <p>Devam Eden: {orders.filter(o => o.courierId === courier.id && o.status === 'InTransit').length}</p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '0.5rem' }}
              onClick={() => handleShowCourierDetails(courier)}
            >
              Detayları Gör
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="card">
      <h2>Teslimat Raporları</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card">
          <h3>Günlük İstatistikler</h3>
          <p>Toplam Sipariş: {orders.length}</p>
          <p>Bekleyen: {orders.filter(o => o.status === 'Pending').length}</p>
          <p>Yolda: {orders.filter(o => o.status === 'InTransit').length}</p>
          <p>Teslim Edilen: {orders.filter(o => o.status === 'Delivered').length}</p>
          <p>İade Edilen: {orders.filter(o => o.status === 'Returned').length}</p>
        </div>
        <div className="card">
          <h3>Kurye Performansı</h3>
          {couriers.map(courier => {
            const courierOrders = orders.filter(o => o.courierId === courier.id);
            const completed = courierOrders.filter(o => o.status === 'Delivered').length;
            const total = courierOrders.length;
            return (
              <div key={courier.id} style={{ marginBottom: '1rem' }}>
                <strong>{courier.firstName} {courier.lastName}</strong>
                <p>Tamamlanan: {completed}/{total} ({total > 0 ? Math.round((completed/total)*100) : 0}%)</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCourierModal = () => {
    if (!selectedCourier) return null;

    const courierOrders = orders.filter(o => o.courierId === selectedCourier.id);
    const completedOrders = courierOrders.filter(o => o.status === 'Delivered');
    const inTransitOrders = courierOrders.filter(o => o.status === 'InTransit');
    const pendingOrders = courierOrders.filter(o => o.status === 'Assigned');

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Kurye Detayları</h2>
            <button 
              onClick={() => setShowCourierModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3>{selectedCourier.firstName} {selectedCourier.lastName}</h3>
            <p><strong>E-posta:</strong> {selectedCourier.email}</p>
            {selectedCourier.phone && <p><strong>Telefon:</strong> {selectedCourier.phone}</p>}
            {selectedCourier.address && <p><strong>Adres:</strong> {selectedCourier.address}</p>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4>İstatistikler</h4>
            <p><strong>Toplam Atanan Sipariş:</strong> {courierOrders.length}</p>
            <p><strong>Tamamlanan:</strong> {completedOrders.length}</p>
            <p><strong>Yolda:</strong> {inTransitOrders.length}</p>
            <p><strong>Bekleyen:</strong> {pendingOrders.length}</p>
            <p><strong>Başarı Oranı:</strong> {courierOrders.length > 0 ? Math.round((completedOrders.length/courierOrders.length)*100) : 0}%</p>
          </div>

          {courierOrders.length > 0 && (
            <div>
              <h4>Atanan Siparişler</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Sipariş ID</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Müşteri</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Tarih</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Durum</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courierOrders.map(order => (
                      <tr key={order.id}>
                        <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>#{order.id}</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{order.userName}</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                          {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                          <span style={{ 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            background: getStatusColor(order.status),
                            color: 'white',
                            fontSize: '0.8rem'
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
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              onClick={() => setShowCourierModal(false)}
              className="btn btn-secondary"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <h1>Koordinatör Paneli</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            Siparişler
          </button>
          <button 
            className={`btn ${activeTab === 'planning' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('planning')}
          >
            Teslimat Planlama
          </button>
          <button 
            className={`btn ${activeTab === 'couriers' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('couriers')}
          >
            Kurye Yönetimi
          </button>
          <button 
            className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reports')}
          >
            Raporlar
          </button>
        </div>
      </div>

      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'planning' && renderDeliveryPlanning()}
      {activeTab === 'couriers' && renderCourierManagement()}
      {activeTab === 'reports' && renderReports()}

      {showCourierModal && renderCourierModal()}
    </div>
  );
};

export default CoordinatorPanel; 
