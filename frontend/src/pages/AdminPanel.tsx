import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ModalAlert from '../components/ModalAlert';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdDate: string;
}

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
  barcode: string;
  categoryId: number;
  categoryName: string;
  isNewRelease: boolean;
  isEditorChoice: boolean;
  rentalCount: number;
  stockCount: number;
  shelfLocation: string;
  price: number;
  imageUrl?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  filmCount: number;
}

interface Package {
  id: number;
  name: string;
  filmCount: number;
  price: number;
  description: string;
  isActive: boolean;
}

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilmModal, setShowFilmModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  
  // Modal Alert states
  const [modalAlert, setModalAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert' as 'confirm' | 'alert' | 'success' | 'error',
    onConfirm: () => {},
    onCancel: () => {}
  });
  
  // Form states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingFilm, setEditingFilm] = useState<Film | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  
  // Form data states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Customer',
    isActive: true
  });
  
  const [filmForm, setFilmForm] = useState({
    title: '',
    director: '',
    actors: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    duration: 120,
    language: 'Türkçe',
    subtitle: 'Türkçe',
    audio: 'Stereo',
    barcode: '',
    categoryId: 1,
    isNewRelease: false,
    isEditorChoice: false,
    stockCount: 1,
    shelfLocation: '',
    price: 0,
    imageUrl: ''
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  
  const [packageForm, setPackageForm] = useState({
    name: '',
    filmCount: 0,
    price: 0,
    description: '',
    isActive: true
  });

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'films') fetchFilms();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'packages') fetchPackages();
  }, [activeTab]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch fonksiyonları
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/users', config);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/films', config);
      setFilms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching films:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/categories', config);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5028/api/packages', config);
      setPackages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:5028/api/users', userForm, config);
      setShowUserModal(false);
      resetUserForm();
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await axios.put(`http://localhost:5028/api/users/${editingUser.id}`, userForm, config);
      setShowUserModal(false);
      resetUserForm();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setModalAlert({
      isOpen: true,
      title: 'Kullanıcı Sil',
      message: 'Bu kullanıcıyı silmek istediğinizden emin misiniz?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5028/api/users/${userId}`, config);
          fetchUsers();
          setModalAlert({ ...modalAlert, isOpen: false });
        } catch (error) {
          console.error('Error deleting user:', error);
          setModalAlert({
            isOpen: true,
            title: 'Hata',
            message: 'Kullanıcı silinirken bir hata oluştu.',
            type: 'error',
            onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
            onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
          });
        }
      },
      onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive
    });
    setShowUserModal(true);
  };

  const resetUserForm = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'Customer',
      isActive: true
    });
    setEditingUser(null);
  };

  const handleCreateFilm = async () => {
    try {
      await axios.post('http://localhost:5028/api/films', filmForm, config);
      setShowFilmModal(false);
      resetFilmForm();
      fetchFilms();
    } catch (error) {
      console.error('Error creating film:', error);
    }
  };

  const handleUpdateFilm = async () => {
    if (!editingFilm) return;
    try {
      await axios.put(`http://localhost:5028/api/films/${editingFilm.id}`, filmForm, config);
      setShowFilmModal(false);
      resetFilmForm();
      fetchFilms();
    } catch (error) {
      console.error('Error updating film:', error);
    }
  };

  const handleDeleteFilm = async (filmId: number) => {
    setModalAlert({
      isOpen: true,
      title: 'Film Sil',
      message: 'Bu filmi silmek istediğinizden emin misiniz?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5028/api/films/${filmId}`, config);
          fetchFilms();
          setModalAlert({ ...modalAlert, isOpen: false });
        } catch (error) {
          console.error('Error deleting film:', error);
          setModalAlert({
            isOpen: true,
            title: 'Hata',
            message: 'Film silinirken bir hata oluştu.',
            type: 'error',
            onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
            onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
          });
        }
      },
      onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
    });
  };

  const handleAddFilm = () => {
    setEditingFilm(null);
    resetFilmForm();
    setShowFilmModal(true);
  };

  const handleEditFilm = (film: Film) => {
    setEditingFilm(film);
    setFilmForm({
      title: film.title,
      director: film.director,
      actors: film.actors,
      description: film.description,
      releaseYear: film.releaseYear,
      duration: film.duration,
      language: film.language,
      subtitle: film.subtitle,
      audio: film.audio,
      barcode: film.barcode,
      categoryId: film.categoryId,
      isNewRelease: film.isNewRelease,
      isEditorChoice: film.isEditorChoice,
      stockCount: film.stockCount,
      shelfLocation: film.shelfLocation,
      price: film.price,
      imageUrl: film.imageUrl || ''
    });
    setShowFilmModal(true);
  };

  const resetFilmForm = () => {
    setFilmForm({
      title: '',
      director: '',
      actors: '',
      description: '',
      releaseYear: new Date().getFullYear(),
      duration: 120,
      language: 'Türkçe',
      subtitle: 'Türkçe',
      audio: 'Stereo',
      barcode: '',
      categoryId: 1,
      isNewRelease: false,
      isEditorChoice: false,
      stockCount: 1,
      shelfLocation: '',
      price: 0,
      imageUrl: ''
    });
    setEditingFilm(null);
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post('http://localhost:5028/api/categories', categoryForm, config);
      setShowCategoryModal(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      await axios.put(`http://localhost:5028/api/categories/${editingCategory.id}`, categoryForm, config);
      setShowCategoryModal(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    setModalAlert({
      isOpen: true,
      title: 'Kategori Sil',
      message: 'Bu kategoriyi silmek istediğinizden emin misiniz?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5028/api/categories/${categoryId}`, config);
          fetchCategories();
          setModalAlert({ ...modalAlert, isOpen: false });
        } catch (error) {
          console.error('Error deleting category:', error);
          setModalAlert({
            isOpen: true,
            title: 'Hata',
            message: 'Kategori silinirken bir hata oluştu.',
            type: 'error',
            onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
            onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
          });
        }
      },
      onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description
    });
    setShowCategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: ''
    });
    setEditingCategory(null);
  };

  const handleCreatePackage = async () => {
    try {
      await axios.post('http://localhost:5028/api/packages', packageForm, config);
      setShowPackageModal(false);
      resetPackageForm();
      fetchPackages();
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage) return;
    try {
      await axios.put(`http://localhost:5028/api/packages/${editingPackage.id}`, packageForm, config);
      setShowPackageModal(false);
      resetPackageForm();
      fetchPackages();
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const handleDeletePackage = async (packageId: number) => {
    setModalAlert({
      isOpen: true,
      title: 'Paket Sil',
      message: 'Bu paketi silmek istediğinizden emin misiniz?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5028/api/packages/${packageId}`, config);
          fetchPackages();
          setModalAlert({ ...modalAlert, isOpen: false });
        } catch (error) {
          console.error('Error deleting package:', error);
          setModalAlert({
            isOpen: true,
            title: 'Hata',
            message: 'Paket silinirken bir hata oluştu.',
            type: 'error',
            onConfirm: () => setModalAlert({ ...modalAlert, isOpen: false }),
            onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
          });
        }
      },
      onCancel: () => setModalAlert({ ...modalAlert, isOpen: false })
    });
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      filmCount: pkg.filmCount,
      price: pkg.price,
      description: pkg.description,
      isActive: pkg.isActive
    });
    setShowPackageModal(true);
  };

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      filmCount: 0,
      price: 0,
      description: '',
      isActive: true
    });
    setEditingPackage(null);
  };

  // Render Functions
  const renderDashboard = () => (
    <div className="card">
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Toplam Kullanıcı</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{users.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Toplam Film</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#51cf66' }}>{films.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Toplam Kategori</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd43b' }}>{categories.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Toplam Paket</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>{packages.length}</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Kullanıcı Yönetimi</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingUser(null);
            resetUserForm();
            setShowUserModal(true);
          }}
        >
          + Yeni Kullanıcı
        </button>
      </div>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Durum</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>{new Date(user.createdDate).toLocaleDateString('tr-TR')}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => handleEditUser(user)}>
                      Düzenle
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderFilms = () => (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Film Yönetimi</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleAddFilm}
        >
          + Yeni Film
        </button>
      </div>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Film Adı</th>
              <th>Yönetmen</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Fiyat</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {films.map(film => (
              <tr key={film.id}>
                <td>{film.title}</td>
                <td>{film.director}</td>
                <td>{film.categoryName}</td>
                <td>{film.stockCount}</td>
                <td>{film.price} ₺</td>
                <td>
                  <span className={`status-badge ${film.stockCount > 0 ? 'status-active' : 'status-inactive'}`}>
                    {film.stockCount > 0 ? 'Mevcut' : 'Tükendi'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => handleEditFilm(film)}>
                      Düzenle
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteFilm(film.id)}>
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Kategori Yönetimi</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingCategory(null);
            resetCategoryForm();
            setShowCategoryModal(true);
          }}
        >
          + Yeni Kategori
        </button>
      </div>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>Açıklama</th>
              <th>Film Sayısı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.filmCount}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => handleEditCategory(category)}>
                      Düzenle
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteCategory(category.id)}>
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderPackages = () => (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Paket Yönetimi</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingPackage(null);
            resetPackageForm();
            setShowPackageModal(true);
          }}
        >
          + Yeni Paket
        </button>
      </div>
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Paket Adı</th>
              <th>Film Sayısı</th>
              <th>Fiyat</th>
              <th>Açıklama</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id}>
                <td>{pkg.name}</td>
                <td>{pkg.filmCount}</td>
                <td>{pkg.price} ₺</td>
                <td>{pkg.description}</td>
                <td>
                  <span className={`status-badge ${pkg.isActive ? 'status-active' : 'status-inactive'}`}>
                    {pkg.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => handleEditPackage(pkg)}>
                      Düzenle
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeletePackage(pkg.id)}>
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <h1>Admin Panel</h1>
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            Kullanıcılar
          </button>
          <button 
            className={`btn ${activeTab === 'films' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('films')}
          >
            Filmler
          </button>
          <button 
            className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('categories')}
          >
            Kategoriler
          </button>
          <button 
            className={`btn ${activeTab === 'packages' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('packages')}
          >
            Paketler
          </button>
        </div>
      </div>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'films' && renderFilms()}
      {activeTab === 'categories' && renderCategories()}
      {activeTab === 'packages' && renderPackages()}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h3>
            <div className="modern-form-group">
              <label className="modern-form-label">Ad</label>
              <input
                type="text"
                className="modern-form-control"
                value={userForm.firstName}
                onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Soyad</label>
              <input
                type="text"
                className="modern-form-control"
                value={userForm.lastName}
                onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Email</label>
              <input
                type="email"
                className="modern-form-control"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Şifre</label>
              <input
                type="password"
                className="modern-form-control"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Rol</label>
              <select
                className="modern-form-control"
                value={userForm.role}
                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Coordinator">Koordinatör</option>
                <option value="Accountant">Muhasebe</option>
                <option value="Warehouse">Depo</option>
                <option value="Courier">Kurye</option>
                <option value="FilmEntry">Film Giriş</option>
                <option value="Customer">Müşteri</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowUserModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn btn-primary" 
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
              >
                {editingUser ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Film Modal */}
      {showFilmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingFilm ? 'Film Düzenle' : 'Yeni Film'}</h3>
            <div className="modern-form-group">
              <label className="modern-form-label">Film Adı</label>
              <input
                type="text"
                className="modern-form-control"
                value={filmForm.title}
                onChange={(e) => setFilmForm({...filmForm, title: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Yönetmen</label>
              <input
                type="text"
                className="modern-form-control"
                value={filmForm.director}
                onChange={(e) => setFilmForm({...filmForm, director: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Oyuncular</label>
              <input
                type="text"
                className="modern-form-control"
                value={filmForm.actors}
                onChange={(e) => setFilmForm({...filmForm, actors: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Açıklama</label>
              <textarea
                className="modern-form-control"
                value={filmForm.description}
                onChange={(e) => setFilmForm({...filmForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modern-form-group">
                <label className="modern-form-label">Yıl</label>
                <input
                  type="number"
                  className="modern-form-control"
                  value={filmForm.releaseYear}
                  onChange={(e) => setFilmForm({...filmForm, releaseYear: parseInt(e.target.value)})}
                />
              </div>
              <div className="modern-form-group">
                <label className="modern-form-label">Süre (dk)</label>
                <input
                  type="number"
                  className="modern-form-control"
                  value={filmForm.duration}
                  onChange={(e) => setFilmForm({...filmForm, duration: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modern-form-group">
                <label className="modern-form-label">Dil</label>
                <input
                  type="text"
                  className="modern-form-control"
                  value={filmForm.language}
                  onChange={(e) => setFilmForm({...filmForm, language: e.target.value})}
                />
              </div>
              <div className="modern-form-group">
                <label className="modern-form-label">Altyazı</label>
                <input
                  type="text"
                  className="modern-form-control"
                  value={filmForm.subtitle}
                  onChange={(e) => setFilmForm({...filmForm, subtitle: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modern-form-group">
                <label className="modern-form-label">Ses</label>
                <input
                  type="text"
                  className="modern-form-control"
                  value={filmForm.audio}
                  onChange={(e) => setFilmForm({...filmForm, audio: e.target.value})}
                />
              </div>
              <div className="modern-form-group">
                <label className="modern-form-label">Barkod</label>
                <input
                  type="text"
                  className="modern-form-control"
                  value={filmForm.barcode}
                  onChange={(e) => setFilmForm({...filmForm, barcode: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modern-form-group">
                <label className="modern-form-label">Kategori</label>
                <select
                  className="modern-form-control"
                  value={filmForm.categoryId}
                  onChange={(e) => setFilmForm({...filmForm, categoryId: parseInt(e.target.value)})}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="modern-form-group">
                <label className="modern-form-label">Stok</label>
                <input
                  type="number"
                  className="modern-form-control"
                  value={filmForm.stockCount}
                  onChange={(e) => setFilmForm({...filmForm, stockCount: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modern-form-group">
                <label className="modern-form-label">Raf Konumu</label>
                <input
                  type="text"
                  className="modern-form-control"
                  value={filmForm.shelfLocation}
                  onChange={(e) => setFilmForm({...filmForm, shelfLocation: e.target.value})}
                />
              </div>
              <div className="modern-form-group">
                <label className="modern-form-label">Fiyat</label>
                <input
                  type="number"
                  step="0.01"
                  className="modern-form-control"
                  value={filmForm.price}
                  onChange={(e) => setFilmForm({...filmForm, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Resim URL</label>
              <input
                type="text"
                className="modern-form-control"
                value={filmForm.imageUrl}
                onChange={(e) => setFilmForm({...filmForm, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={filmForm.isNewRelease}
                  onChange={(e) => setFilmForm({...filmForm, isNewRelease: e.target.checked})}
                />
                Yeni Çıkan
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={filmForm.isEditorChoice}
                  onChange={(e) => setFilmForm({...filmForm, isEditorChoice: e.target.checked})}
                />
                Editör Seçimi
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowFilmModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn btn-primary" 
                onClick={editingFilm ? handleUpdateFilm : handleCreateFilm}
              >
                {editingFilm ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}</h3>
            <div className="modern-form-group">
              <label className="modern-form-label">Kategori Adı</label>
              <input
                type="text"
                className="modern-form-control"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
              />
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Açıklama</label>
              <textarea
                className="modern-form-control"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCategoryModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn btn-primary" 
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
              >
                {editingCategory ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Modal */}
      {showPackageModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingPackage ? 'Paket Düzenle' : 'Yeni Paket'}</h3>
            <div className="modern-form-group">
              <label className="modern-form-label">Paket Adı</label>
              <input
                type="text"
                className="modern-form-control"
                value={packageForm.name}
                onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modern-form-group">
                <label className="modern-form-label">Film Sayısı</label>
                <input
                  type="number"
                  className="modern-form-control"
                  value={packageForm.filmCount}
                  onChange={(e) => setPackageForm({...packageForm, filmCount: parseInt(e.target.value)})}
                />
              </div>
              <div className="modern-form-group">
                <label className="modern-form-label">Fiyat</label>
                <input
                  type="number"
                  step="0.01"
                  className="modern-form-control"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({...packageForm, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="modern-form-group">
              <label className="modern-form-label">Açıklama</label>
              <textarea
                className="modern-form-control"
                value={packageForm.description}
                onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowPackageModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn btn-primary" 
                onClick={editingPackage ? handleUpdatePackage : handleCreatePackage}
              >
                {editingPackage ? 'Güncelle' : 'Oluştur'}
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

export default AdminPanel; 
