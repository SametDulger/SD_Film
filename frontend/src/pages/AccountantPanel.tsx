import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ModalAlert from '../components/ModalAlert';

interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  deliveryDate?: string;
  returnDate?: string;
  totalAmount: number;
  status: string;
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

interface FinancialReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  categoryRevenue: { category: string; revenue: number }[];
}

const AccountantPanel: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Modal Alert state
  const [modalAlert, setModalAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert' as 'confirm' | 'alert' | 'success' | 'error',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchOrders();
    fetchFinancialReport();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/orders', config);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialReport = async () => {
    try {
      const response = await axios.get('http://localhost:5028/api/financial/report', config);
      setFinancialReport(response.data.data || null);
    } catch (error) {
      console.error('Error fetching financial report:', error);
    }
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

  const getMonthName = (month: number) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[month];
  };

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
  });

  const completedOrders = orders.filter(order => order.status === 'Delivered');
  const pendingOrders = orders.filter(order => order.status === 'Pending' || order.status === 'Assigned' || order.status === 'InTransit');

  const renderOverview = () => (
    <div className="card">
      <h2>Finansal Genel Bakış</h2>
      {financialReport ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div className="card" style={{ textAlign: 'center', background: '#e8f5e8' }}>
            <h3>Toplam Gelir</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>
              {financialReport.totalRevenue.toLocaleString()} ₺
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: '#fff3e0' }}>
            <h3>Toplam Sipariş</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00' }}>
              {financialReport.totalOrders}
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: '#e3f2fd' }}>
            <h3>Ortalama Sipariş</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
              {financialReport.averageOrderValue.toFixed(2)} ₺
            </p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: '#f3e5f5' }}>
            <h3>Tamamlanan Sipariş</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7b1fa2' }}>
              {completedOrders.length}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Finansal rapor yükleniyor...</p>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="card">
      <h2>Sipariş Yönetimi</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ padding: '0.5rem' }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{getMonthName(i)}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '0.5rem' }}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>

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
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Detaylar</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
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
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        const details = order.orderDetails.map(detail => 
                          `${detail.filmTitle} (x${detail.quantity}) - ${detail.totalPrice} ₺`
                        ).join('\n');
                        setModalAlert({
                          isOpen: true,
                          title: 'Sipariş Detayları',
                          message: details,
                          type: 'alert',
                          onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
                          onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
                        });
                      }}
                    >
                      Detayları Gör
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderRevenueAnalysis = () => (
    <div className="card">
      <h2>Gelir Analizi</h2>
      {financialReport ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div className="card">
            <h3>Aylık Gelir Grafiği</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '0.5rem', padding: '1rem' }}>
              {financialReport.monthlyRevenue.map((item, index) => (
                <div key={index} style={{ 
                  flex: 1, 
                  background: '#007bff', 
                  height: `${(item.revenue / Math.max(...financialReport.monthlyRevenue.map(r => r.revenue))) * 200}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'end',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '0.8rem'
                }}>
                  <span>{item.revenue.toFixed(0)} ₺</span>
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3>Kategori Bazında Gelir</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {financialReport.categoryRevenue.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <span>{item.category}</span>
                  <strong>{item.revenue.toFixed(2)} ₺</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Gelir analizi yükleniyor...</p>
        </div>
      )}
    </div>
  );

  const renderExpenseTracking = () => (
    <div className="card">
      <h2>Gider Takibi</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card">
          <h3>Operasyonel Giderler</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Personel Maaşları</span>
              <strong>15,000 ₺</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Kurye Maliyetleri</span>
              <strong>3,500 ₺</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Depo Kiraları</span>
              <strong>2,000 ₺</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Yazılım Lisansları</span>
              <strong>500 ₺</strong>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Toplam</span>
              <strong>21,000 ₺</strong>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3>Kar Analizi</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Toplam Gelir</span>
              <strong>{financialReport?.totalRevenue.toLocaleString() || 0} ₺</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Toplam Gider</span>
              <strong>21,000 ₺</strong>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#28a745' }}>
              <span>Net Kar</span>
              <strong>{((financialReport?.totalRevenue || 0) - 21000).toLocaleString()} ₺</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Kar Marjı</span>
              <strong>{financialReport ? ((financialReport.totalRevenue - 21000) / financialReport.totalRevenue * 100).toFixed(1) : 0}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="card">
      <h2>Mali Raporlar</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card">
          <h3>Günlük İstatistikler</h3>
          <p>Bugünkü Sipariş: {orders.filter(o => new Date(o.orderDate).toDateString() === new Date().toDateString()).length}</p>
          <p>Bugünkü Gelir: {orders.filter(o => new Date(o.orderDate).toDateString() === new Date().toDateString()).reduce((sum, o) => sum + o.totalAmount, 0)} ₺</p>
          <p>Bekleyen Ödemeler: {pendingOrders.length}</p>
          <p>Toplam Değer: {pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0)} ₺</p>
        </div>
        
        <div className="card">
          <h3>Müşteri Analizi</h3>
          <p>Toplam Müşteri: {new Set(orders.map(o => o.userId)).size}</p>
          <p>Aktif Müşteri: {new Set(orders.filter(o => o.status === 'Delivered').map(o => o.userId)).size}</p>
          <p>Ortalama Müşteri Değeri: {financialReport ? (financialReport.totalRevenue / new Set(orders.map(o => o.userId)).size).toFixed(2) : 0} ₺</p>
        </div>
        
        <div className="card">
          <h3>Performans Metrikleri</h3>
          <p>Tamamlanma Oranı: {orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0}%</p>
          <p>Ortalama Teslimat Süresi: 2.5 gün</p>
          <p>Müşteri Memnuniyeti: 4.2/5</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="card">
        <h1>Muhasebe Paneli</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Genel Bakış
          </button>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            Siparişler
          </button>
          <button 
            className={`btn ${activeTab === 'revenue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('revenue')}
          >
            Gelir Analizi
          </button>
          <button 
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('expenses')}
          >
            Gider Takibi
          </button>
          <button 
            className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reports')}
          >
            Raporlar
          </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'revenue' && renderRevenueAnalysis()}
      {activeTab === 'expenses' && renderExpenseTracking()}
      {activeTab === 'reports' && renderReports()}

      {/* Modal Alert */}
      <ModalAlert
        isOpen={modalAlert.isOpen}
        title={modalAlert.title}
        message={modalAlert.message}
        type={modalAlert.type}
        onConfirm={modalAlert.onConfirm}
        onCancel={modalAlert.onCancel}
      />
    </div>
  );
};

export default AccountantPanel; 
