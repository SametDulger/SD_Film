import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ModalAlert from '../components/ModalAlert';

interface Film {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  categoryName: string;
  stockCount: number;
  barcode: string;
  shelfLocation: string;
}

interface Category {
  id: number;
  name: string;
}

const FilmEntryPanel: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal Alert state
  const [modalAlert, setModalAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert' as 'confirm' | 'alert' | 'success' | 'error',
    onConfirm: () => {},
    onCancel: () => {}
  });
  
  const [newFilm, setNewFilm] = useState({
    title: '',
    director: '',
    actors: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    duration: 120,
    language: 'Türkçe',
    subtitle: 'Türkçe',
    audio: 'Stereo',
    categoryId: 1,
    price: 0,
    barcode: '',
    shelfLocation: '',
    stockCount: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [filmsResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:5028/api/films'),
        axios.get('http://localhost:5028/api/categories')
      ]);
      
      setFilms(filmsResponse.data.data || []);
      setCategories(categoriesResponse.data.data || []);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFilm(prev => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'duration' || name === 'categoryId' || name === 'price' || name === 'stockCount' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5028/api/films', newFilm);
      if (response.data.success) {
        setNewFilm({
          title: '',
          director: '',
          actors: '',
          description: '',
          releaseYear: new Date().getFullYear(),
          duration: 120,
          language: 'Türkçe',
          subtitle: 'Türkçe',
          audio: 'Stereo',
          categoryId: 1,
          price: 0,
          barcode: '',
          shelfLocation: '',
          stockCount: 1
        });
        fetchData();
        setModalAlert({
          isOpen: true,
          title: 'Başarılı',
          message: 'Film başarıyla eklendi!',
          type: 'success',
          onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
          onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
        });
      }
    } catch (err: any) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: err.response?.data?.message || 'Film eklenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  const handleStockUpdate = async (filmId: number, newStock: number) => {
    if (newStock < 0) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: 'Stok miktarı negatif olamaz!',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
      return;
    }
    try {
      await axios.put(`http://localhost:5028/api/films/${filmId}/stock`, { newStockCount: newStock });
      fetchData();
      setModalAlert({
        isOpen: true,
        title: 'Başarılı',
        message: 'Stok güncellendi!',
        type: 'success',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    } catch (err: any) {
      setModalAlert({
        isOpen: true,
        title: 'Hata',
        message: err.response?.data?.message || 'Stok güncellenirken bir hata oluştu',
        type: 'error',
        onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
        onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
      });
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="card">
        <h1>Film Girişi Paneli</h1>
        <p>Yeni film ekleyin ve mevcut filmlerin stok durumunu yönetin.</p>
      </div>

      <div className="card">
        <h2>Yeni Film Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Film Adı *</label>
              <input
                type="text"
                name="title"
                value={newFilm.title}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Yönetmen *</label>
              <input
                type="text"
                name="director"
                value={newFilm.director}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Oyuncular</label>
            <input
              type="text"
              name="actors"
              value={newFilm.actors}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Açıklama</label>
            <textarea
              name="description"
              value={newFilm.description}
              onChange={handleInputChange}
              className="form-control"
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Yıl</label>
              <input
                type="number"
                name="releaseYear"
                value={newFilm.releaseYear}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Süre (dk)</label>
              <input
                type="number"
                name="duration"
                value={newFilm.duration}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                name="categoryId"
                value={newFilm.categoryId}
                onChange={handleInputChange}
                className="form-control"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fiyat (₺)</label>
              <input
                type="number"
                name="price"
                value={newFilm.price}
                onChange={handleInputChange}
                className="form-control"
                step="0.01"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Dil</label>
              <input
                type="text"
                name="language"
                value={newFilm.language}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Altyazı</label>
              <input
                type="text"
                name="subtitle"
                value={newFilm.subtitle}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ses</label>
              <input
                type="text"
                name="audio"
                value={newFilm.audio}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Barkod</label>
              <input
                type="text"
                name="barcode"
                value={newFilm.barcode}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Raf Konumu</label>
              <input
                type="text"
                name="shelfLocation"
                value={newFilm.shelfLocation}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stok Adedi</label>
              <input
                type="number"
                name="stockCount"
                value={newFilm.stockCount}
                onChange={handleInputChange}
                className="form-control"
                min="1"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Film Ekle
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Mevcut Filmler</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Film</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Yönetmen</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Kategori</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Stok</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Barkod</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Raf</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {films.map((film) => (
                <tr key={film.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.title}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.director}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.categoryName}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <input
                      type="number"
                      value={Math.max(0, film.stockCount)}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        handleStockUpdate(film.id, Math.max(0, value));
                      }}
                      style={{ width: '60px', padding: '0.25rem' }}
                      min="0"
                    />
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.barcode || '-'}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{film.shelfLocation || '-'}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleStockUpdate(film.id, film.stockCount + 1)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      +1
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleStockUpdate(film.id, Math.max(0, film.stockCount - 1))}
                    >
                      -1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default FilmEntryPanel; 
