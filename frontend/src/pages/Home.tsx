import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <div className="hero">
        <h1>SD Film'e Hoş Geldiniz</h1>
        <p>En sevdiğiniz filmleri kolayca kiralayın ve evinizin konforunda izleyin</p>
        <Link to="/films" className="btn btn-primary">
          Filmleri Keşfet
        </Link>
      </div>

      <div className="card">
        <h2>Neden SD Film?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h3>🎬 Geniş Film Koleksiyonu</h3>
            <p>Binlerce film arasından seçim yapın. Aksiyon, komedi, drama ve daha fazlası.</p>
          </div>
          <div>
            <h3>🚚 Hızlı Teslimat</h3>
            <p>Seçtiğiniz filmler 2 gün içinde kapınıza teslim edilir.</p>
          </div>
          <div>
            <h3>💰 Uygun Fiyatlar</h3>
            <p>Ekonomik paketlerle film keyfinizi sürün.</p>
          </div>
          <div>
            <h3>📱 Kolay Kullanım</h3>
            <p>Modern web arayüzü ile kolayca film seçin ve sipariş verin.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Popüler Kategoriler</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/films?category=1" className="btn btn-secondary" style={{ textAlign: 'center' }}>
            Aksiyon
          </Link>
          <Link to="/films?category=2" className="btn btn-secondary" style={{ textAlign: 'center' }}>
            Komedi
          </Link>
          <Link to="/films?category=3" className="btn btn-secondary" style={{ textAlign: 'center' }}>
            Drama
          </Link>
          <Link to="/films?category=4" className="btn btn-secondary" style={{ textAlign: 'center' }}>
            Bilim Kurgu
          </Link>
          <Link to="/films?category=5" className="btn btn-secondary" style={{ textAlign: 'center' }}>
            Korku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 
