import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface Film {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  description: string;
  categoryName: string;
  isNewRelease: boolean;
  isEditorChoice: boolean;
  rentalCount: number;
  stockCount: number;
  imageUrl?: string;
}

const Films: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFilms();
  }, [categoryId]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (term: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          performSearch(term);
        }, 300); // 300ms delay
      };
    })(),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      fetchFilms();
    }
  }, [searchTerm, debouncedSearch]);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5028/api/films';
      
      if (categoryId) {
        url = `http://localhost:5028/api/films/category/${categoryId}`;
      }
      
      const response = await axios.get(url);
      setFilms(response.data.data || []);
    } catch (err) {
      setError('Filmler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      fetchFilms();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5028/api/films/search?q=${encodeURIComponent(term)}`);
      setFilms(response.data.data || []);
    } catch (err) {
      setError('Arama yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchFilms();
    // Focus'u koru
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    // Kategori değiştirirken arama terimini temizle
    setSearchTerm('');
    if (categoryId) {
      window.location.href = `/films?category=${categoryId}`;
    } else {
      window.location.href = '/films';
    }
  };

  if (loading) {
    return <div className="loading">Filmler yükleniyor...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="card">
        <h1>Filmler</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Film, yönetmen veya oyuncu ara..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="form-control"
              style={{ paddingRight: searchTerm ? '2.5rem' : '1rem' }}
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => handleCategoryClick(null)} className="btn btn-secondary">
            Tümü
          </button>
          <button onClick={() => handleCategoryClick('1')} className="btn btn-secondary">
            Aksiyon
          </button>
          <button onClick={() => handleCategoryClick('2')} className="btn btn-secondary">
            Komedi
          </button>
          <button onClick={() => handleCategoryClick('3')} className="btn btn-secondary">
            Drama
          </button>
          <button onClick={() => handleCategoryClick('4')} className="btn btn-secondary">
            Bilim Kurgu
          </button>
          <button onClick={() => handleCategoryClick('5')} className="btn btn-secondary">
            Korku
          </button>
        </div>
      </div>

      {films.length === 0 ? (
        <div className="card">
          <p>{searchTerm ? `"${searchTerm}" için film bulunamadı.` : 'Film bulunamadı.'}</p>
        </div>
      ) : (
        <div className="film-grid">
          {films.map((film) => (
            <div key={film.id} className="film-card">
              <div className="film-image">
                {film.imageUrl ? (
                  <img 
                    src={film.imageUrl} 
                    alt={film.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0'
                    }}
                    onError={(e) => {
                      // Resim yüklenemezse placeholder göster
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  style={{
                    width: '100%',
                    height: '200px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: film.imageUrl ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px 8px 0 0',
                    fontSize: '3rem',
                    color: 'white'
                  }}
                >
                  🎬
                </div>
              </div>
              <div className="film-content">
                <h3 className="film-title">{film.title}</h3>
                <p className="film-director">Yönetmen: {film.director}</p>
                <p className="film-year">{film.releaseYear}</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                  {film.description?.substring(0, 100)}...
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#95a5a6' }}>
                    Stok: {film.stockCount}
                  </span>
                  <Link to={`/films/${film.id}`} className="btn btn-primary">
                    Detaylar
                  </Link>
                </div>
                {film.isNewRelease && (
                  <span style={{ 
                    background: '#e74c3c', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    display: 'inline-block'
                  }}>
                    Yeni Çıkan
                  </span>
                )}
                {film.isEditorChoice && (
                  <span style={{ 
                    background: '#f39c12', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    marginLeft: '0.5rem',
                    display: 'inline-block'
                  }}>
                    Editör Seçimi
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Films; 
