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
  lastUpdated?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface StockMovement {
  id: number;
  filmId: number;
  filmTitle: string;
  movementType: string;
  quantity: number;
  date: string;
  notes?: string;
}

const WarehousePanel: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [films, setFilms] = useState<Film[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showRemoveStockModal, setShowRemoveStockModal] = useState(false);
  const [showAddFilmModal, setShowAddFilmModal] = useState(false);
  const [selectedFilmId, setSelectedFilmId] = useState(0);
  const [addStockQuantity, setAddStockQuantity] = useState(1);
  const [removeStockQuantity, setRemoveStockQuantity] = useState(1);
  const [newFilm, setNewFilm] = useState({
    title: '',
    director: '',
    categoryId: 0,
    price: 0,
    stockCount: 0,
    description: '',
    releaseYear: 0,
    isAvailable: true
  });
  
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
    fetchFilms();
    fetchCategories();
    fetchStockMovements();
  }, []);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/films', config);
      setFilms(response.data.data || []);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5028/api/categories', config);
      setCategories(response.data.data || []);
    } catch (error) {
      // Error handling
    }
  };

  const fetchStockMovements = async () => {
    try {
      const response = await axios.get('http://localhost:5028/api/stock-movements', config);
      setStockMovements(response.data.data || []);
    } catch (error) {
      // Error handling
    }
  };

  const handleAddStock = async () => {
    if (addStockQuantity <= 0) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Stok miktarı 0\'dan büyük olmalıdır!',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
      return;
    }

    try {
      await axios.post(`http://localhost:5028/api/films/${selectedFilmId}/add-stock`, {
        quantity: addStockQuantity
      }, config);
      
      setModalAlert({
        isOpen: true,
        title: 'Başarılı',
        message: 'Stok eklendi!',
        type: 'success',
        onConfirm: () => {
          setModalAlert({ ...modalAlert, isOpen: false });
          setShowAddStockModal(false);
          setAddStockQuantity(1);
          fetchFilms();
        },
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Stok eklenirken hata oluştu.',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleRemoveStock = async () => {
    if (removeStockQuantity <= 0) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Stok miktarı 0\'dan büyük olmalıdır!',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
      return;
    }

    try {
      await axios.post(`http://localhost:5028/api/films/${selectedFilmId}/remove-stock`, {
        quantity: removeStockQuantity
      }, config);
      
      setModalAlert({
        isOpen: true,
        title: 'Başarılı',
        message: 'Stok çıkarıldı!',
        type: 'success',
        onConfirm: () => {
          setModalAlert({ ...modalAlert, isOpen: false });
          setShowRemoveStockModal(false);
          setRemoveStockQuantity(1);
          fetchFilms();
        },
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Stok çıkarılırken hata oluştu.',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleAddFilm = async () => {
    try {
      await axios.post('http://localhost:5028/api/films', newFilm, config);
      setModalAlert({
        isOpen: true,
        title: 'Başarılı',
        message: 'Film eklendi!',
        type: 'success',
        onConfirm: () => {
          setModalAlert({ ...modalAlert, isOpen: false });
          setShowAddFilmModal(false);
          resetNewFilmForm();
          fetchFilms();
        },
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    } catch (error) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Film eklenirken hata oluştu.',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const filteredFilms = films.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || film.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderInventory = () => (
    <div className="card">
      <h2>Envanter Yönetimi</h2>
      
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
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
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
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Film</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Yönetmen</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Kategori</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Stok</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Fiyat</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Durum</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredFilms.map(film => (
                <tr key={film.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.title}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.director}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.categoryName}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <span style={{ 
                      color: film.stockCount === 0 ? '#dc3545' : 
                             film.stockCount < 5 ? '#ffc107' : '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {film.stockCount}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.price} ₺</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      background: film.isAvailable ? '#d4edda' : '#f8d7da',
                      color: film.isAvailable ? '#155724' : '#721c24'
                    }}>
                      {film.isAvailable ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        className="btn btn-success"
                        onClick={() => {
                          setSelectedFilmId(film.id);
                          setAddStockQuantity(parseInt(prompt('Eklenecek stok miktarı:') || '1'));
                          setShowAddStockModal(true);
                        }}
                      >
                        Stok Ekle
                      </button>
                      <button 
                        className="btn btn-warning"
                        onClick={() => {
                          const quantity = prompt('Çıkarılacak stok miktarı:');
                          if (quantity && !isNaN(parseInt(quantity))) {
                            const qty = parseInt(quantity);
                            if (qty > 0) {
                              if (qty <= film.stockCount) {
                                setSelectedFilmId(film.id);
                                setRemoveStockQuantity(qty);
                                setShowRemoveStockModal(true);
                              } else {
                                setModalAlert({
                                  isOpen: true,
                                  title: 'Hata',
                                  message: `Yetersiz stok! Mevcut stok: ${film.stockCount}`,
                                  type: 'error',
                                  onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
                                  onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
                                });
                              }
                            } else {
                              setModalAlert({
                                isOpen: true,
                                title: 'Hata',
                                message: 'Stok miktarı 0\'dan büyük olmalıdır!',
                                type: 'error',
                                onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
                                onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
                              });
                            }
                          }
                        }}
                        disabled={film.stockCount === 0}
                      >
                        Stok Çıkar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAddFilm = () => (
    <div className="card">
      <h2>Film Ekleme</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const filmData = {
          title: formData.get('title') as string,
          director: formData.get('director') as string,
          categoryId: parseInt(formData.get('categoryId') as string),
          price: parseFloat(formData.get('price') as string),
          stockCount: parseInt(formData.get('stockCount') as string),
          description: formData.get('description') as string,
          releaseYear: parseInt(formData.get('releaseYear') as string),
          isAvailable: true
        };
        handleAddFilm();
        e.currentTarget.reset();
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Film Adı</label>
            <input type="text" name="title" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Yönetmen</label>
            <input type="text" name="director" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select name="categoryId" className="form-control" required>
              <option value="">Kategori Seçin</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fiyat (₺)</label>
            <input type="number" name="price" step="0.01" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Stok Miktarı</label>
            <input type="number" name="stockCount" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Yayın Yılı</label>
            <input type="number" name="releaseYear" className="form-control" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Açıklama</label>
          <textarea name="description" className="form-control" rows={3}></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Film Ekle</button>
      </form>
    </div>
  );

  const renderStockMovements = () => (
    <div className="card">
      <h2>Stok Hareketleri</h2>
      {stockMovements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Henüz stok hareketi bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Tarih</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Film</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Hareket Tipi</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Miktar</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Notlar</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map(movement => (
                <tr key={movement.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {new Date(movement.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{movement.filmTitle}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      background: movement.movementType === 'In' ? '#d4edda' : '#f8d7da',
                      color: movement.movementType === 'In' ? '#155724' : '#721c24'
                    }}>
                      {movement.movementType === 'In' ? 'Giriş' : 'Çıkış'}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{movement.quantity}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{movement.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="card">
      <h2>Depo Raporları</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card">
          <h3>Genel İstatistikler</h3>
          <p>Toplam Film: {films.length}</p>
          <p>Toplam Stok: {films.reduce((sum, film) => sum + film.stockCount, 0)}</p>
          <p>Stokta Olmayan: {films.filter(f => f.stockCount === 0).length}</p>
          <p>Düşük Stok (≤5): {films.filter(f => f.stockCount > 0 && f.stockCount <= 5).length}</p>
        </div>
        <div className="card">
          <h3>Kategori Bazında Stok</h3>
          {categories.map(category => {
            const categoryFilms = films.filter(f => f.categoryName === category.name);
            const totalStock = categoryFilms.reduce((sum, film) => sum + film.stockCount, 0);
            return (
              <div key={category.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{category.name}:</strong> {totalStock} adet
              </div>
            );
          })}
        </div>
        <div className="card">
          <h3>Son Stok Hareketleri</h3>
          {stockMovements.slice(0, 5).map(movement => (
            <div key={movement.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <strong>{movement.filmTitle}</strong>
              <p style={{ margin: '0.2rem 0' }}>
                {movement.movementType === 'In' ? '+' : '-'}{movement.quantity} - 
                {new Date(movement.date).toLocaleDateString('tr-TR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const resetNewFilmForm = () => {
    setNewFilm({
      title: '',
      director: '',
      categoryId: 0,
      price: 0,
      stockCount: 0,
      description: '',
      releaseYear: 0,
      isAvailable: true
    });
  };

  return (
    <div>
      <div className="card">
        <h1>Depo Paneli</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Envanter
          </button>
          <button 
            className={`btn ${activeTab === 'add-film' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('add-film')}
          >
            Film Ekle
          </button>
          <button 
            className={`btn ${activeTab === 'movements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('movements')}
          >
            Stok Hareketleri
          </button>
          <button 
            className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reports')}
          >
            Raporlar
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'add-film' && renderAddFilm()}
      {activeTab === 'movements' && renderStockMovements()}
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

export default WarehousePanel; 
