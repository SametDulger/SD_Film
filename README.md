# SD Film - Film Kiralama Sistemi

> ⚠️ **Geliştirme Aşamasında** ⚠️
> 
> Bu proje aktif geliştirme aşamasındadır ve henüz tamamlanmamıştır. Projede eksik özellikler, bilinen hatalar ve geliştirilmesi gereken alanlar bulunmaktadır. Üretim ortamında kullanmadan önce kapsamlı test ve geliştirme yapılması önerilir.
> 
> **Bilinen Durumlar:**
> - Bazı özellikler henüz tamamlanmamıştır
> - Hata ayıklama ve optimizasyon çalışmaları devam etmektedir
> - API endpoint'leri geliştirme aşamasındadır
> - Güvenlik testleri henüz tamamlanmamıştır
> - Dokümantasyon sürekli güncellenmektedir

---

SD Film, klasik DVD film kiralama dükkanını dijital ortama taşıyan modern bir web uygulamasıdır. Kullanıcılar online olarak film kiralayabilir, teslimat tarihlerini belirleyebilir ve sistem otomatik olarak film stok durumuna göre dağıtım planlaması yapabilir.

## 🚀 Özellikler

### Kullanıcı Özellikleri
- **Üye Kayıt ve Giriş**: Güvenli kullanıcı kayıt ve giriş sistemi
- **Film Arama**: Film adı, yönetmen ve oyuncu bazında arama
- **Kategori Filtreleme**: Aksiyon, komedi, drama, bilim kurgu, korku kategorileri
- **Film Detayları**: Detaylı film bilgileri ve stok durumu
- **Film Listesi**: Kişisel film listesi oluşturma
- **Sipariş Verme**: Online film kiralama sistemi

### Yönetim Özellikleri
- **Film Yönetimi**: Film ekleme, düzenleme, silme
- **Stok Yönetimi**: Film stok takibi ve güncelleme
- **Kullanıcı Yönetimi**: Kullanıcı hesapları yönetimi
- **Sipariş Takibi**: Sipariş durumu takibi
- **Raporlama**: Film ve kullanıcı bazlı raporlar

## 🏗️ Teknoloji Stack

### Backend
- **.NET 9**: Web API framework
- **Entity Framework Core**: ORM
- **SQLite**: Veritabanı
- **AutoMapper**: Object mapping
- **JWT**: Kimlik doğrulama

### Frontend
- **React 18**: UI framework
- **TypeScript**: Tip güvenliği
- **React Router**: Sayfa yönlendirme
- **Axios**: HTTP client
- **CSS3**: Modern styling

## 📁 Proje Yapısı

```
SD_Film/
├── Backend/
│   ├── SDFilm.API/           # Web API katmanı
│   ├── SDFilm.Business/      # İş mantığı katmanı
│   ├── SDFilm.DataAccess/    # Veri erişim katmanı
│   ├── SDFilm.Entities/      # Veritabanı entity'leri
│   └── SDFilm.Core/          # Ortak yapılar ve DTO'lar
├── frontend/                 # React uygulaması
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

## 📊 Veritabanı Şeması

### Ana Tablolar
- **Users**: Kullanıcı bilgileri
- **Films**: Film bilgileri
- **Categories**: Film kategorileri
- **Packages**: Üyelik paketleri
- **Orders**: Sipariş bilgileri
- **OrderDetails**: Sipariş detayları
- **UserFilmLists**: Kullanıcı film listeleri

## 🔐 API Endpoints

### Kullanıcı İşlemleri
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/{id}` - Kullanıcı detayı
- `POST /api/users` - Yeni kullanıcı oluştur
- `PUT /api/users/{id}` - Kullanıcı güncelle
- `DELETE /api/users/{id}` - Kullanıcı sil
- `POST /api/users/login` - Kullanıcı girişi

### Film İşlemleri
- `GET /api/films` - Tüm filmleri listele
- `GET /api/films/{id}` - Film detayı
- `GET /api/films/category/{categoryId}` - Kategoriye göre filmler
- `GET /api/films/search?q={term}` - Film arama
- `GET /api/films/new-releases` - Yeni çıkanlar
- `GET /api/films/editor-choices` - Editör seçimleri
- `GET /api/films/most-rented` - En çok kiralananlar
- `POST /api/films` - Yeni film oluştur
- `PUT /api/films/{id}` - Film güncelle
- `DELETE /api/films/{id}` - Film sil
- `PUT /api/films/{id}/stock` - Stok güncelle

## 🎨 Kullanıcı Arayüzü

### Ana Sayfa
- Hoş geldin mesajı ve özellikler
- Popüler kategoriler
- Hızlı erişim linkleri

### Filmler Sayfası
- Film grid görünümü
- Arama ve filtreleme
- Kategori seçimi
- Film kartları

### Film Detay Sayfası
- Detaylı film bilgileri
- Stok durumu
- Kiralama butonu
- Film özeti

### Giriş/Kayıt Sayfaları
- Kullanıcı dostu formlar
- Validasyon
- Hata mesajları

## 🔧 Geliştirme

### SOLID Prensipleri
- **Single Responsibility**: Her sınıf tek bir sorumluluğa sahip
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

## 🚀 Deployment

### Backend Deployment
```bash
dotnet publish -c Release
```

### Frontend Deployment
```bash
npm run build
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
