using Microsoft.EntityFrameworkCore;
using SDFilm.Entities;
using BCrypt.Net;

namespace SDFilm.DataAccess
{
    public class SDFilmDbContext : DbContext
    {
        public SDFilmDbContext(DbContextOptions<SDFilmDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Film> Films { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<UserFilmList> UserFilmLists { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<UserPackage> UserPackages { get; set; }
        public DbSet<Cart> Carts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Film configuration
            modelBuilder.Entity<Film>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Director).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Cast).HasMaxLength(500);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.Barcode).HasMaxLength(50);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Category).WithMany(c => c.Films).HasForeignKey(e => e.CategoryId);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.OrderDate).IsRequired();
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.DeliveryAddress).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                entity.HasOne(e => e.User).WithMany(u => u.Orders).HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.Courier).WithMany().HasForeignKey(e => e.CourierId);
            });

            // OrderDetail configuration
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).IsRequired();
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Order).WithMany(o => o.OrderDetails).HasForeignKey(e => e.OrderId);
                entity.HasOne(e => e.Film).WithMany().HasForeignKey(e => e.FilmId);
            });

            // Package configuration
            modelBuilder.Entity<Package>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.FilmCount).IsRequired();
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            // UserFilmList configuration
            modelBuilder.Entity<UserFilmList>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AddedDate).IsRequired();
                entity.Property(e => e.Review).HasMaxLength(1000);
                entity.HasOne(e => e.User).WithMany(u => u.UserFilmLists).HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.Film).WithMany().HasForeignKey(e => e.FilmId);
            });

            // StockMovement configuration
            modelBuilder.Entity<StockMovement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MovementType).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Quantity).IsRequired();
                entity.Property(e => e.Notes).HasMaxLength(1000);
            });

            // UserPackage configuration
            modelBuilder.Entity<UserPackage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PurchaseDate).IsRequired();
                entity.Property(e => e.ExpiryDate).IsRequired();
                entity.Property(e => e.RemainingFilms).IsRequired();
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.Package).WithMany().HasForeignKey(e => e.PackageId);
            });

            // Cart configuration
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).IsRequired();
                entity.Property(e => e.AddedDate).IsRequired();
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.Film).WithMany().HasForeignKey(e => e.FilmId);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Aksiyon", Description = "Aksiyon filmleri" },
                new Category { Id = 2, Name = "Komedi", Description = "Komedi filmleri" },
                new Category { Id = 3, Name = "Drama", Description = "Drama filmleri" },
                new Category { Id = 4, Name = "Bilim Kurgu", Description = "Bilim kurgu filmleri" },
                new Category { Id = 5, Name = "Korku", Description = "Korku filmleri" },
                new Category { Id = 6, Name = "Romantik", Description = "Romantik filmleri" }
            );

            // Packages
            modelBuilder.Entity<Package>().HasData(
                new Package { Id = 1, Name = "Başlangıç Paketi", FilmCount = 3, Price = 29.99m, Description = "Aylık 3 film" },
                new Package { Id = 2, Name = "Standart Paket", FilmCount = 5, Price = 49.99m, Description = "Aylık 5 film" },
                new Package { Id = 3, Name = "Premium Paket", FilmCount = 10, Price = 89.99m, Description = "Aylık 10 film" }
            );

            // Films
            modelBuilder.Entity<Film>().HasData(
                new Film
                {
                    Id = 1,
                    Title = "The Dark Knight",
                    Description = "Batman'in Joker ile mücadelesini anlatan epik aksiyon filmi",
                    Director = "Christopher Nolan",
                    Cast = "Christian Bale, Heath Ledger, Aaron Eckhart",
                    ReleaseYear = 2008,
                    Barcode = "DK001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
                    Price = 15.99m,
                    IsAvailable = true,
                    CategoryId = 1,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "Dolby Digital 5.1",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 5,
                    ShelfLocation = "A1-01",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 2,
                    Title = "Inception",
                    Description = "Rüyalar içinde geçen zihin bükücü bilim kurgu filmi",
                    Director = "Christopher Nolan",
                    Cast = "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
                    ReleaseYear = 2010,
                    Barcode = "IN001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
                    Price = 18.99m,
                    IsAvailable = true,
                    CategoryId = 4,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "DTS-HD Master Audio",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 3,
                    ShelfLocation = "B2-03",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 3,
                    Title = "The Shawshank Redemption",
                    Description = "Umut ve dostluğun hapishane duvarlarını aştığı dramatik hikaye",
                    Director = "Frank Darabont",
                    Cast = "Tim Robbins, Morgan Freeman, Bob Gunton",
                    ReleaseYear = 1994,
                    Barcode = "SR001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
                    Price = 12.99m,
                    IsAvailable = true,
                    CategoryId = 3,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "Dolby Digital 5.1",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 4,
                    ShelfLocation = "C3-02",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 4,
                    Title = "The Hangover",
                    Description = "Las Vegas'ta geçen unutulmaz bir düğün öncesi komedi",
                    Director = "Todd Phillips",
                    Cast = "Bradley Cooper, Ed Helms, Zach Galifianakis",
                    ReleaseYear = 2009,
                    Barcode = "HG001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
                    Price = 14.99m,
                    IsAvailable = true,
                    CategoryId = 2,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "Dolby Digital 5.1",
                    IsNewRelease = false,
                    IsEditorChoice = false,
                    RentalCount = 0,
                    StockCount = 6,
                    ShelfLocation = "D4-01",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 5,
                    Title = "The Conjuring",
                    Description = "Gerçek olaylardan esinlenen korku filmi",
                    Director = "James Wan",
                    Cast = "Patrick Wilson, Vera Farmiga, Ron Livingston",
                    ReleaseYear = 2013,
                    Barcode = "CJ001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BMTU3NzEzNzY3N15BMl5BanBnXkFtZTgwNzE1NzY3NzE@._V1_.jpg",
                    Price = 16.99m,
                    IsAvailable = true,
                    CategoryId = 5,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "DTS-HD Master Audio",
                    IsNewRelease = false,
                    IsEditorChoice = false,
                    RentalCount = 0,
                    StockCount = 2,
                    ShelfLocation = "E5-04",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 6,
                    Title = "La La Land",
                    Description = "Los Angeles'ta geçen müzikal romantik komedi",
                    Director = "Damien Chazelle",
                    Cast = "Ryan Gosling, Emma Stone, John Legend",
                    ReleaseYear = 2016,
                    Barcode = "LL001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg",
                    Price = 17.99m,
                    IsAvailable = true,
                    CategoryId = 6,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "Dolby Atmos",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 4,
                    ShelfLocation = "F6-03",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 7,
                    Title = "Mad Max: Fury Road",
                    Description = "Post-apokaliptik dünyada geçen aksiyon filmi",
                    Director = "George Miller",
                    Cast = "Tom Hardy, Charlize Theron, Nicholas Hoult",
                    ReleaseYear = 2015,
                    Barcode = "MM001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
                    Price = 19.99m,
                    IsAvailable = true,
                    CategoryId = 1,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "DTS:X",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 3,
                    ShelfLocation = "A1-05",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 8,
                    Title = "Interstellar",
                    Description = "Uzay yolculuğu ve zaman yolculuğu temalı bilim kurgu",
                    Director = "Christopher Nolan",
                    Cast = "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
                    ReleaseYear = 2014,
                    Barcode = "IS001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
                    Price = 20.99m,
                    IsAvailable = true,
                    CategoryId = 4,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "DTS-HD Master Audio",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 2,
                    ShelfLocation = "B2-06",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 9,
                    Title = "Forrest Gump",
                    Description = "Amerikan tarihinin önemli olaylarını yaşayan bir adamın hikayesi",
                    Director = "Robert Zemeckis",
                    Cast = "Tom Hanks, Robin Wright, Gary Sinise",
                    ReleaseYear = 1994,
                    Barcode = "FG001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
                    Price = 13.99m,
                    IsAvailable = true,
                    CategoryId = 3,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "Dolby Digital 5.1",
                    IsNewRelease = false,
                    IsEditorChoice = true,
                    RentalCount = 0,
                    StockCount = 5,
                    ShelfLocation = "C3-07",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                new Film
                {
                    Id = 10,
                    Title = "Superbad",
                    Description = "Lise son sınıf öğrencilerinin komik maceraları",
                    Director = "Greg Mottola",
                    Cast = "Jonah Hill, Michael Cera, Christopher Mintz-Plasse",
                    ReleaseYear = 2007,
                    Barcode = "SB001",
                    ImageUrl = "https://m.media-amazon.com/images/M/MV5BMTc0NjIyMjA0OF5BMl5BanBnXkFtZTcwMzIxNDE1MQ@@._V1_.jpg",
                    Price = 11.99m,
                    IsAvailable = true,
                    CategoryId = 2,
                    Language = "İngilizce",
                    Subtitle = "Türkçe",
                    Audio = "Dolby Digital 5.1",
                    IsNewRelease = false,
                    IsEditorChoice = false,
                    RentalCount = 0,
                    StockCount = 7,
                    ShelfLocation = "D4-08",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                }
            );

            // Sample Orders
            modelBuilder.Entity<Order>().HasData(
                new Order
                {
                    Id = 1,
                    UserId = 8, // customer1
                    OrderDate = new DateTime(2025, 1, 15),
                    TotalAmount = 28.98m,
                    Status = "Pending",
                    DeliveryAddress = "Atatürk Mahallesi, Cumhuriyet Caddesi No:123, Ankara",
                    Notes = "Lütfen akşam saatlerinde teslim edin",
                    CreatedDate = new DateTime(2025, 1, 15),
                    IsActive = true
                },
                new Order
                {
                    Id = 2,
                    UserId = 9, // customer2
                    OrderDate = new DateTime(2025, 1, 16),
                    TotalAmount = 32.98m,
                    Status = "Assigned",
                    DeliveryAddress = "Kızılay Meydanı, İstiklal Sokak No:45, Ankara",
                    CourierId = 5, // courier1
                    CreatedDate = new DateTime(2025, 1, 16),
                    IsActive = true
                },
                new Order
                {
                    Id = 3,
                    UserId = 10, // customer3
                    OrderDate = new DateTime(2025, 1, 17),
                    TotalAmount = 15.99m,
                    Status = "InTransit",
                    DeliveryAddress = "Çankaya Mahallesi, Başkent Bulvarı No:67, Ankara",
                    CourierId = 6, // courier2
                    CreatedDate = new DateTime(2025, 1, 17),
                    IsActive = true
                }
            );

            // Sample Order Details
            modelBuilder.Entity<OrderDetail>().HasData(
                new OrderDetail
                {
                    Id = 1,
                    OrderId = 1,
                    FilmId = 1,
                    Quantity = 1,
                    UnitPrice = 15.99m,
                    TotalPrice = 15.99m,
                    CreatedDate = new DateTime(2025, 1, 15),
                    IsActive = true
                },
                new OrderDetail
                {
                    Id = 2,
                    OrderId = 1,
                    FilmId = 4,
                    Quantity = 1,
                    UnitPrice = 14.99m,
                    TotalPrice = 14.99m,
                    CreatedDate = new DateTime(2025, 1, 15),
                    IsActive = true
                },
                new OrderDetail
                {
                    Id = 3,
                    OrderId = 2,
                    FilmId = 2,
                    Quantity = 1,
                    UnitPrice = 18.99m,
                    TotalPrice = 18.99m,
                    CreatedDate = new DateTime(2025, 1, 16),
                    IsActive = true
                },
                new OrderDetail
                {
                    Id = 4,
                    OrderId = 2,
                    FilmId = 6,
                    Quantity = 1,
                    UnitPrice = 17.99m,
                    TotalPrice = 17.99m,
                    CreatedDate = new DateTime(2025, 1, 16),
                    IsActive = true
                },
                new OrderDetail
                {
                    Id = 5,
                    OrderId = 3,
                    FilmId = 1,
                    Quantity = 1,
                    UnitPrice = 15.99m,
                    TotalPrice = 15.99m,
                    CreatedDate = new DateTime(2025, 1, 17),
                    IsActive = true
                }
            );

            // Users for all roles
            modelBuilder.Entity<User>().HasData(
                // Admin
                new User
                {
                    Id = 1,
                    Email = "admin@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Admin",
                    LastName = "User",
                    Role = "Admin",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Coordinator
                new User
                {
                    Id = 2,
                    Email = "coordinator@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Ahmet",
                    LastName = "Koç",
                    Role = "Coordinator",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Accountant
                new User
                {
                    Id = 3,
                    Email = "accountant@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Ayşe",
                    LastName = "Demir",
                    Role = "Accountant",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Warehouse
                new User
                {
                    Id = 4,
                    Email = "warehouse@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Mehmet",
                    LastName = "Yılmaz",
                    Role = "Warehouse",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Courier 1
                new User
                {
                    Id = 5,
                    Email = "courier1@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Ali",
                    LastName = "Kaya",
                    Role = "Courier",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Courier 2
                new User
                {
                    Id = 6,
                    Email = "courier2@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Fatma",
                    LastName = "Özkan",
                    Role = "Courier",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // FilmEntry
                new User
                {
                    Id = 7,
                    Email = "filmentry@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Can",
                    LastName = "Arslan",
                    Role = "FilmEntry",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Customer 1
                new User
                {
                    Id = 8,
                    Email = "customer1@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Zeynep",
                    LastName = "Çelik",
                    Role = "Customer",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Customer 2
                new User
                {
                    Id = 9,
                    Email = "customer2@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Burak",
                    LastName = "Şahin",
                    Role = "Customer",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                },
                // Customer 3
                new User
                {
                    Id = 10,
                    Email = "customer3@sdfilm.com",
                    PasswordHash = "$2a$11$V.N86xcmHWJSUnFwsc2YiOprwTPApFsIGm61IMaFtaVEVPIk89EEi", // password: admin123
                    FirstName = "Elif",
                    LastName = "Yıldız",
                    Role = "Customer",
                    IsActive = true,
                    CreatedDate = new DateTime(2025, 1, 1)
                }
            );
        }
    }
} 