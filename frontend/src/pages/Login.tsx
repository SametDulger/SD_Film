import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5028/api/users/login', formData);
      
      if (response.data.success) {
        login(response.data.data, response.data.user);
        navigate('/');
      } else {
        setError(response.data.message || 'Giriş başarısız');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      {/* Sample credentials info box */}
      <div style={{
        background: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        fontSize: '0.95rem',
        color: '#333'
      }}>
        <strong>Test Giriş Bilgileri:</strong>
        <p style={{ margin: '0.5rem 0', color: '#e74c3c', fontWeight: 'bold' }}>
          Tüm kullanıcılar için şifre: <b>admin123</b>
        </p>
        <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0 }}>
          <li><b>Admin:</b> admin@sdfilm.com</li>
          <li><b>Koordinatör:</b> coordinator@sdfilm.com</li>
          <li><b>Muhasebe:</b> accountant@sdfilm.com</li>
          <li><b>Depo:</b> warehouse@sdfilm.com</li>
          <li><b>Kurye 1:</b> courier1@sdfilm.com</li>
          <li><b>Kurye 2:</b> courier2@sdfilm.com</li>
          <li><b>Film Giriş:</b> filmentry@sdfilm.com</li>
          <li><b>Müşteri 1:</b> customer1@sdfilm.com</li>
          <li><b>Müşteri 2:</b> customer2@sdfilm.com</li>
          <li><b>Müşteri 3:</b> customer3@sdfilm.com</li>
        </ul>
      </div>
      <div className="card">
        <h2>Giriş Yap</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>
            Hesabınız yok mu?{' '}
            <Link to="/register" style={{ color: '#3498db' }}>
              Kayıt olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
