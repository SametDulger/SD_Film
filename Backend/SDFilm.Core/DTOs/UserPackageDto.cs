namespace SDFilm.Core.DTOs
{
    public class UserPackageDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int PackageId { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int RemainingFilms { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUserPackageDto
    {
        public int UserId { get; set; }
        public int PackageId { get; set; }
    }

    public class UpdateUserPackageDto
    {
        public int RemainingFilms { get; set; }
        public bool IsActive { get; set; }
    }
} 