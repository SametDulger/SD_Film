import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ModalAlert from '../components/ModalAlert';

interface Film {
  id: number;
  title: string;
  director: string;
  categoryName: string;
  price: number;
  isAvailable: boolean;
  stockCount: number;
  description?: string;
  releaseYear?: number;
}

interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  orderDetails: OrderDetail[];
  notes?: string;
}

interface OrderDetail {
  id: number;
  filmTitle: string;
  quantity: number;
  totalPrice: number;
}

interface UserFilmList {
  id: number;
  filmId: number;
  filmTitle: string;
  filmDirector: string;
  addedDate: string;
  isWatched: boolean;
  rating?: number;
  review?: string;
}

interface CartItem {
  id: number;
  filmId: number;
  filmTitle: string;
  filmDirector: string;
  filmPrice: number;
  quantity: number;
  totalPrice: number;
  addedDate: string;
}

interface CartSummary {
  totalItems: number;
  totalAmount: number;
  items: CartItem[];
}

const CustomerPanel: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('films');
  const [films, setFilms] = useState<Film[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userFilmList, setUserFilmList] = useState<UserFilmList[]>([]);
  const [cart, setCart] = useState<CartSummary>({ totalItems: 0, totalAmount: 0, items: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Modal Alert state
  const [modalAlert, setModalAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert' as 'confirm' | 'alert' | 'success' | 'error',
    onConfirm: () => {},
    onCancel: () => {}
  });

  useEffect(() => {
    fetchFilms();
    fetchOrders();
    fetchUserFilmList();
    fetchCart();
  }, []);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(films.map(film => film.categoryName)));
    setCategories(uniqueCategories);
  }, [films]);

  useEffect(() => {
    if (activeTab === 'list') {
      fetchUserFilmList();
    } else if (activeTab === 'cart') {
      fetchCart();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5028/api/films', config);
      setFilms(response.data.data || []);
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Filmler yüklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`http://localhost:5028/api/orders/user/${user?.id}`, config);
      setOrders(response.data.data || []);
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Siparişler yüklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const fetchUserFilmList = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5028/api/userfilmlists/my-list', config);
      setUserFilmList(response.data.data || []);
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Film listesi yüklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const fetchCart = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5028/api/cart', config);
      setCart(response.data.data || { totalItems: 0, totalAmount: 0, items: [] });
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Sepet yüklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleAddToCart = async (filmId: number) => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      const response = await axios.post('http://localhost:5028/api/cart', {
        filmId: filmId,
        quantity: 1
      }, config);
      fetchCart();
    } catch (error: any) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Sepete eklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleUpdateCartItem = async (cartItemId: number, quantity: number) => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      await axios.put(`http://localhost:5028/api/cart/${cartItemId}`, {
        quantity: quantity
      }, config);
      fetchCart();
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Sepet güncellenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleRemoveFromCart = async (cartItemId: number) => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      await axios.delete(`http://localhost:5028/api/cart/${cartItemId}`, config);
      fetchCart();
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Sepetten çıkarılırken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleClearCart = async () => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    setModalAlert({
      isOpen: true,
      title: 'Sepeti Temizle',
      message: 'Sepeti temizlemek istediğinizden emin misiniz?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await axios.delete('http://localhost:5028/api/cart/clear', config);
          fetchCart();
          setModalAlert({ ...modalAlert, isOpen: false });
        } catch (error) {
          setModalAlert({
            isOpen: true,
            title: 'Hata',
            message: 'Sepet temizlenirken bir hata oluştu',
            type: 'error',
            onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
            onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
          });
        }
      },
      onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
    });
  };

  const handleCheckout = async () => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    if (!deliveryAddress.trim()) {
      return;
    }

    try {
      await axios.post('http://localhost:5028/api/cart/checkout', {
        deliveryAddress: deliveryAddress
      }, config);
      setShowCheckoutModal(false);
      setDeliveryAddress('');
      fetchCart();
      fetchOrders();
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Sipariş oluşturulurken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleAddToList = async (filmId: number) => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      const response = await axios.post('http://localhost:5028/api/userfilmlists', {
        filmId: filmId
      }, config);
      fetchUserFilmList();
    } catch (error: any) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Listeye eklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleRemoveFromList = async (listItemId: number) => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      await axios.delete(`http://localhost:5028/api/userfilmlists/${listItemId}`, config);
      fetchUserFilmList();
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Listeden çıkarılırken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleMarkAsWatched = async (listItemId: number, isWatched: boolean) => {
    if (!token) {
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      await axios.put(`http://localhost:5028/api/userfilmlists/${listItemId}`, {
        isWatched: isWatched
      }, config);
      fetchUserFilmList();
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Film durumu güncellenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
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

  const filteredFilms = films.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || film.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderFilms = () => (
    <div className="card">
      <h2>Filmler</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Film veya yönetmen ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.5rem' }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredFilms.map(film => {
            const isDisabled = (film.isAvailable === false) || film.stockCount === 0;
            
            return (
              <div key={film.id} className="card" style={{ border: '1px solid #ddd' }}>
                <h3>{film.title}</h3>
                <p><strong>Yönetmen:</strong> {film.director}</p>
                <p><strong>Kategori:</strong> {film.categoryName}</p>
                {film.releaseYear && <p><strong>Yıl:</strong> {film.releaseYear}</p>}
                <p><strong>Fiyat:</strong> {film.price} ₺</p>
                <p><strong>Stok:</strong> {film.stockCount}</p>
                {film.description && <p>{film.description}</p>}
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(film.id)}
                    style={{ 
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      opacity: isDisabled ? 0.5 : 1
                    }}
                  >
                    Sepete Ekle
                  </button>
                  {userFilmList.some(item => item.filmId === film.id) ? (
                    <button 
                      className="btn btn-danger"
                      onClick={() => {
                        const listItem = userFilmList.find(item => item.filmId === film.id);
                        if (listItem) {
                          handleRemoveFromList(listItem.id);
                        }
                      }}
                      style={{ 
                        pointerEvents: 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      Listeden Kaldır
                    </button>
                  ) : (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAddToList(film.id)}
                      style={{ 
                        pointerEvents: 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      Listeye Ekle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="card">
      <h2>Siparişlerim</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Henüz siparişiniz yok.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Sipariş #{order.id}</h3>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  background: getStatusColor(order.status),
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {order.status}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>Tarih:</strong> {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                </div>
                <div>
                  <strong>Toplam:</strong> {order.totalAmount} ₺
                </div>
                <div>
                  <strong>Adres:</strong> {order.deliveryAddress}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Filmler:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {order.orderDetails.map(detail => (
                    <li key={detail.id}>
                      {detail.filmTitle} (x{detail.quantity}) - {detail.totalPrice} ₺
                    </li>
                  ))}
                </ul>
              </div>

              {order.notes && (
                <div style={{ padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Notlar:</strong> {order.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFilmList = () => (
    <div className="card">
      <h2>Film Listem ({userFilmList.length} film)</h2>
      
      {userFilmList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Henüz film listeniz boş.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {userFilmList.map(item => (
            <div key={item.id} className="card" style={{ border: '1px solid #ddd', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{item.filmTitle}</h4>
                  <p><strong>Yönetmen:</strong> {item.filmDirector}</p>
                  <p><strong>Eklenme Tarihi:</strong> {new Date(item.addedDate).toLocaleDateString('tr-TR')}</p>
                  {item.rating && <p><strong>Puanınız:</strong> {item.rating}/5</p>}
                  {item.review && <p><strong>Yorumunuz:</strong> {item.review}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={item.isWatched}
                      onChange={(e) => handleMarkAsWatched(item.id, e.target.checked)}
                    />
                    İzledim
                  </label>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRemoveFromList(item.id)}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="card">
      <h2>Profil Bilgileri</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="card" style={{ border: '1px solid #ddd' }}>
          <h3>Kişisel Bilgiler</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Ad:</strong> {user?.firstName}
            </div>
            <div>
              <strong>Soyad:</strong> {user?.lastName}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Telefon:</strong> {user?.phone || 'Belirtilmemiş'}
            </div>
            <div>
              <strong>Adres:</strong> {user?.address || 'Belirtilmemiş'}
            </div>
          </div>
        </div>

        <div className="card" style={{ border: '1px solid #ddd' }}>
          <h3>Üyelik Bilgileri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Üyelik Tarihi:</strong> {user?.createdDate ? new Date(user.createdDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
            </div>
            <div>
              <strong>Toplam Sipariş:</strong> {orders.length}
            </div>
            <div>
              <strong>Toplam Harcama:</strong> {orders.reduce((sum, order) => sum + order.totalAmount, 0)} ₺
            </div>
            <div>
              <strong>Film Listesi:</strong> {userFilmList.length} film
            </div>
            <div>
              <strong>Sepetteki Ürün:</strong> {cart.totalItems} adet
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Main Content Area */}
      <div style={{ flex: '1' }}>
        <div className="card">
          <h1>Müşteri Paneli</h1>
          <p>Hoş geldin, {user?.firstName} {user?.lastName}!</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${activeTab === 'films' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('films')}
            >
              Filmler
            </button>
            <button 
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('orders')}
            >
              Siparişlerim
            </button>
            <button 
              className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('list')}
            >
              Film Listem
            </button>
            <button 
              className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profil
            </button>
          </div>
        </div>

        {activeTab === 'films' && renderFilms()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'list' && renderFilmList()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Cart Sidebar */}
      <div style={{ width: '350px', position: 'sticky', top: '1rem' }}>
        <div className="card">
          <h2>Sepetim ({cart.totalItems} ürün)</h2>
          
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Sepetiniz boş.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Toplam: {cart.totalAmount} ₺</h3>
              </div>

              <div style={{ display: 'grid', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {cart.items.map(item => (
                  <div key={item.id} className="card" style={{ border: '1px solid #ddd', padding: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{item.filmTitle}</h4>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Yönetmen:</strong> {item.filmDirector}</p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Birim Fiyat:</strong> {item.filmPrice} ₺</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={() => handleUpdateCartItem(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Toplam:</strong> {item.totalPrice} ₺</p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-danger"
                      style={{ width: '100%', marginTop: '0.5rem', padding: '0.25rem', fontSize: '0.8rem' }}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-warning" onClick={handleClearCart} style={{ flex: '1' }}>
                  Sepeti Temizle
                </button>
                <button className="btn btn-success" onClick={() => setShowCheckoutModal(true)} style={{ flex: '1' }}>
                  Sipariş Ver
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h3>Sipariş Onayı</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Teslimat Adresi:</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
                placeholder="Teslimat adresinizi girin..."
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Toplam Tutar:</strong> {cart.totalAmount} ₺
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCheckoutModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn btn-success"
                onClick={handleCheckout}
              >
                Siparişi Onayla
              </button>
            </div>
          </div>
        </div>
      )}

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

export default CustomerPanel; 
