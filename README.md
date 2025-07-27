# SD Film - Film Kiralama Sistemi

> 🚀 **Geliştirilmiş ve İyileştirilmiş Versiyon** 🚀
> 
> Bu proje modern film kiralama sistemi olarak geliştirilmiştir. Katmanlı mimari, güvenlik önlemleri ve kapsamlı özellikler ile donatılmıştır.

---

SD Film, klasik DVD film kiralama dükkanını dijital ortama taşıyan modern bir web uygulamasıdır. Kullanıcılar online olarak film kiralayabilir, teslimat tarihlerini belirleyebilir ve sistem otomatik olarak film stok durumuna göre dağıtım planlaması yapabilir.

## 🚀 Özellikler

### Kullanıcı Özellikleri
- **Güvenli Kimlik Doğrulama**: JWT tabanlı güvenli giriş sistemi
- **Rol Tabanlı Yetkilendirme**: Admin, Coordinator, Accountant, Warehouse, Courier, FilmEntry, Customer rolleri
- **Film Arama ve Filtreleme**: Gelişmiş arama ve kategori filtreleme
- **Sepet Yönetimi**: Film ekleme, çıkarma ve miktar güncelleme
- **Sipariş Takibi**: Gerçek zamanlı sipariş durumu takibi
- **Stok Kontrolü**: Anlık stok durumu görüntüleme

### Yönetim Özellikleri
- **Film Yönetimi**: CRUD işlemleri, stok yönetimi
- **Kullanıcı Yönetimi**: Rol tabanlı kullanıcı yönetimi
- **Sipariş Yönetimi**: Sipariş durumu güncelleme ve takip
- **Stok Hareketleri**: Giriş/çıkış hareketleri takibi
- **Finansal Raporlar**: Detaylı finansal analizler
- **Paket Yönetimi**: Üyelik paketleri yönetimi

## 🏗️ Teknoloji Stack

### Backend
- **.NET 9**: Modern web API framework
- **Entity Framework Core**: ORM ve veritabanı yönetimi
- **SQLite**: Hafif ve güvenilir veritabanı
- **AutoMapper**: Object mapping
- **JWT**: Güvenli kimlik doğrulama
- **FluentValidation**: Input validation
- **Serilog**: Yapılandırılmış logging
- **Swagger/OpenAPI**: API dokümantasyonu

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Tip güvenliği
- **React Router v6**: Sayfa yönlendirme
- **Material-UI v5**: Modern UI bileşenleri
- **Axios**: HTTP client
- **Context API**: State management

## 📁 Proje Yapısı

```
SD_Film/
├── Backend/
│   ├── SDFilm.API/           # Web API katmanı
│   │   ├── Controllers/      # API endpoint'leri
│   │   ├── Middleware/       # Global exception handling
│   │   ├── Validators/       # Input validation
│   │   └── Program.cs        # Uygulama konfigürasyonu
│   ├── SDFilm.Business/      # İş mantığı katmanı
│   │   ├── Interfaces/       # Service interface'leri
│   │   ├── Services/         # İş mantığı implementasyonları
│   │   └── Mapping/          # AutoMapper profilleri
│   ├── SDFilm.DataAccess/    # Veri erişim katmanı
│   │   └── SDFilmDbContext.cs # Entity Framework context
│   ├── SDFilm.Entities/      # Veritabanı entity'leri
│   └── SDFilm.Core/          # Ortak yapılar ve DTO'lar
├── frontend/                 # React uygulaması
│   ├── src/
│   │   ├── components/       # Yeniden kullanılabilir bileşenler
│   │   ├── pages/           # Sayfa bileşenleri
│   │   ├── services/        # API servisleri
│   │   └── AuthContext.tsx  # Kimlik doğrulama context'i
│   └── package.json
└── README.md
```

## 🛠️ Kurulum

### Gereksinimler
- .NET 9 SDK
- Node.js 18+
- npm veya yarn

### Backend Kurulumu

1. Backend klasörüne gidin:
```bash
cd Backend/SDFilm.API
```

2. Bağımlılıkları yükleyin:
```bash
dotnet restore
```

3. Veritabanını oluşturun:
```bash
dotnet ef database update
```

4. Uygulamayı çalıştırın:
```bash
dotnet run
```

Backend API `https://localhost:7001` adresinde çalışacaktır.
Swagger dokümantasyonu: `https://localhost:7001`

### Frontend Kurulumu

1. Frontend klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı çalıştırın:
```bash
npm start
```

Frontend uygulaması `http://localhost:3000` adresinde çalışacaktır.

## 🔐 Güvenlik Özellikleri

- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Role-Based Authorization**: Rol tabanlı yetkilendirme sistemi
- **Input Validation**: FluentValidation ile kapsamlı input doğrulama
- **Global Exception Handling**: Merkezi hata yönetimi
- **CORS Configuration**: Güvenli cross-origin istekleri
- **Password Hashing**: BCrypt ile şifre hashleme

## 📊 Veritabanı Şeması

### Ana Tablolar
- **Users**: Kullanıcı bilgileri ve rolleri
- **Films**: Film bilgileri ve stok durumu
- **Categories**: Film kategorileri
- **Orders**: Sipariş bilgileri
- **OrderDetails**: Sipariş detayları
- **Cart**: Sepet işlemleri
- **StockMovements**: Stok hareketleri
- **Packages**: Üyelik paketleri
- **UserPackages**: Kullanıcı paket ilişkileri

## 🔧 API Endpoints

### Kimlik Doğrulama
- `POST /api/users/login` - Kullanıcı girişi
- `POST /api/users` - Yeni kullanıcı kaydı

### Film İşlemleri
- `GET /api/films` - Filmleri listele (pagination destekli)
- `GET /api/films/{id}` - Film detayı
- `GET /api/films/category/{categoryId}` - Kategoriye göre filmler
- `GET /api/films/search?q={term}` - Film arama
- `GET /api/films/new-releases` - Yeni çıkanlar
- `GET /api/films/editor-choices` - Editör seçimleri
- `GET /api/films/most-rented` - En çok kiralananlar
- `POST /api/films` - Yeni film oluştur (FilmEntry yetkisi gerekli)
- `PUT /api/films/{id}` - Film güncelle (FilmEntry yetkisi gerekli)
- `DELETE /api/films/{id}` - Film sil (FilmEntry yetkisi gerekli)
- `PUT /api/films/{id}/stock` - Stok güncelle (Warehouse yetkisi gerekli)

### Sipariş İşlemleri
- `GET /api/orders` - Siparişleri listele
- `GET /api/orders/{id}` - Sipariş detayı
- `POST /api/orders` - Yeni sipariş oluştur
- `PUT /api/orders/{id}/status` - Sipariş durumu güncelle

### Sepet İşlemleri
- `GET /api/cart` - Sepeti görüntüle
- `POST /api/cart` - Sepete film ekle
- `PUT /api/cart/{filmId}` - Sepet miktarı güncelle
- `DELETE /api/cart/{filmId}` - Sepetten film çıkar

## 🎨 Kullanıcı Arayüzü

### Modern Tasarım
- **Responsive Design**: Tüm cihazlarda uyumlu
- **Material-UI**: Modern ve tutarlı tasarım
- **Dark/Light Theme**: Tema desteği
- **Loading States**: Kullanıcı deneyimi iyileştirmeleri

### Sayfa Yapısı
- **Ana Sayfa**: Hoş geldin mesajı ve özellikler
- **Filmler**: Grid görünümü, arama ve filtreleme
- **Film Detay**: Detaylı bilgiler ve kiralama
- **Giriş/Kayıt**: Güvenli kimlik doğrulama
- **Panel Sayfaları**: Rol tabanlı yönetim panelleri

## 🔧 Geliştirme Özellikleri

### SOLID Prensipleri
- **Single Responsibility**: Her sınıf tek sorumluluğa sahip
- **Open/Closed**: Genişletmeye açık, değişikliğe kapalı
- **Liskov Substitution**: Alt sınıflar üst sınıfların yerine geçebilir
- **Interface Segregation**: Küçük ve özel interface'ler
- **Dependency Inversion**: Bağımlılık tersine çevirme

### Katmanlı Mimari
- **API Layer**: HTTP istekleri ve yanıtları
- **Business Layer**: İş mantığı ve kurallar
- **Data Access Layer**: Veritabanı işlemleri
- **Entity Layer**: Veri modelleri
- **Core Layer**: Ortak yapılar ve DTO'lar

### Logging ve Monitoring
- **Serilog**: Yapılandırılmış logging
- **File Logging**: Günlük log dosyaları
- **Console Logging**: Geliştirme ortamı için
- **Error Tracking**: Hata takibi ve raporlama

## 🚀 Deployment

### Backend Deployment
```bash
dotnet publish -c Release -o ./publish
```

### Frontend Deployment
```bash
npm run build
```

### Environment Variables
```bash
# Production
JWT_SECRET_KEY=your-secret-key-here
DATABASE_CONNECTION_STRING=your-db-connection
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz

---

**SD Film** - Modern film kiralama deneyimi 🎬 
