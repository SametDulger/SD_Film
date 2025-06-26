import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

interface Film {
  id: number;
  title: string;
  director: string;
  actors: string;
  description: string;
  releaseYear: number;
  duration: number;
  language: string;
  subtitle: string;
  audio: string;
  categoryName: string;
  isNewRelease: boolean;
  isEditorChoice: boolean;
  rentalCount: number;
  stockCount: number;
  shelfLocation: string;
  imageUrl?: string;
}

const FilmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilm();
  }, [id]);

  const fetchFilm = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5028/api/films/${id}`);
      setFilm(response.data.data);
    } catch (err) {
      setError('Film bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post('http://localhost:5028/api/cart', {
        filmId: film?.id,
        quantity: 1
      }, config);
      // Sepete eklendi mesajı göstermek isterseniz burada ekleyebilirsiniz
    } catch (error) {
      setError('Sepete eklenirken bir hata oluştu');
    }
  };

  const handleAddToList = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post('http://localhost:5028/api/userfilmlists', {
        filmId: film?.id
      }, config);
      // Listeye eklendi mesajı göstermek isterseniz burada ekleyebilirsiniz
    } catch (error) {
      setError('Listeye eklenirken bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="loading">Film detayları yükleniyor...</div>;
  }

  if (error || !film) {
    return <div className="alert alert-error">{error || 'Film bulunamadı'}</div>;
  }

  return (
    <div>
      <div className="card">
        <Link to="/films" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Filmler Listesine Dön
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          <div>
            <div className="film-image" style={{ height: '400px', fontSize: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f3f3', borderRadius: '8px' }}>
              {film.imageUrl ? (
                <img
                  src={film.imageUrl}
                  alt={film.title}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                '🎬'
              )}
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h3>Film Bilgileri</h3>
              <p><strong>Kategori:</strong> {film.categoryName}</p>
              <p><strong>Yıl:</strong> {film.releaseYear}</p>
              <p><strong>Süre:</strong> {film.duration} dakika</p>
              <p><strong>Dil:</strong> {film.language}</p>
              <p><strong>Altyazı:</strong> {film.subtitle}</p>
              <p><strong>Ses:</strong> {film.audio}</p>
              <p><strong>Stok:</strong> {film.stockCount}</p>
              <p><strong>Kiralama Sayısı:</strong> {film.rentalCount}</p>
              {film.shelfLocation && (
                <p><strong>Raf Konumu:</strong> {film.shelfLocation}</p>
              )}
            </div>

            {film.isNewRelease && (
              <span style={{ 
                background: '#e74c3c', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px', 
                fontSize: '0.9rem',
                display: 'inline-block',
                marginTop: '1rem'
              }}>
                Yeni Çıkan
              </span>
            )}
            
            {film.isEditorChoice && (
              <span style={{ 
                background: '#f39c12', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px', 
                fontSize: '0.9rem',
                display: 'inline-block',
                marginTop: '0.5rem',
                marginLeft: '0.5rem'
              }}>
                Editör Seçimi
              </span>
            )}
          </div>

          <div>
            <h1>{film.title}</h1>
            <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '1rem' }}>
              Yönetmen: {film.director}
            </p>
            
            {film.actors && (
              <div style={{ marginBottom: '1rem' }}>
                <h3>Oyuncular</h3>
                <p>{film.actors}</p>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <h3>Özet</h3>
              <p>{film.description}</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ marginRight: '1rem' }}
                disabled={film.stockCount === 0}
                onClick={handleAddToCart}
              >
                {film.stockCount > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
              <button className="btn btn-secondary" onClick={handleAddToList}>
                Listeye Ekle
              </button>
            </div>

            {film.stockCount === 0 && (
              <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                Bu film şu anda stokta bulunmamaktadır.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmDetail; 
