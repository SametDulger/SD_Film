import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) {
      return (
        <>
          <li><Link to="/" className="nav-link">Ana Sayfa</Link></li>
          <li><Link to="/films" className="nav-link">Filmler</Link></li>
        </>
      );
    }

    // Her kullanıcı grubunun erişebileceği sayfaları tanımla
    const userPermissions = {
      Admin: ['/', '/films', '/admin', '/coordinator', '/accountant', '/warehouse', '/courier', '/filmentry', '/customer'],
      Coordinator: ['/', '/films', '/coordinator'],
      Accountant: ['/', '/films', '/accountant'],
      Warehouse: ['/', '/films', '/warehouse'],
      Courier: ['/', '/films', '/courier'],
      FilmEntry: ['/', '/films', '/filmentry'],
      Customer: ['/', '/films', '/customer']
    };

    const allowedPaths = userPermissions[user.role as keyof typeof userPermissions] || ['/', '/films'];
    
    const pathLabels: { [key: string]: string } = {
      '/': 'Ana Sayfa',
      '/films': 'Filmler',
      '/admin': 'Admin',
      '/coordinator': 'Koordinatör',
      '/accountant': 'Muhasebe',
      '/warehouse': 'Depo',
      '/courier': 'Kurye',
      '/filmentry': 'Film Giriş',
      '/customer': 'Müşteri'
    };

    return allowedPaths.map(path => (
      <li key={path}>
        <Link to={path} className="nav-link">{pathLabels[path]}</Link>
      </li>
    ));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">SD Film</Link>
        <ul className="navbar-nav">
          {getNavLinks()}
          {user ? (
            <li><button className="btn btn-secondary" onClick={handleLogout}>Çıkış</button></li>
          ) : (
            <li><Link to="/login" className="btn btn-primary">Giriş</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 
