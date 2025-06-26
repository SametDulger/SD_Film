using System.ComponentModel.DataAnnotations;

namespace SDFilm.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        [MaxLength(500)]
        public string? Address { get; set; }
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Customer";
        
        public bool IsActive { get; set; } = true;
        
        public int? PackageId { get; set; }
        public Package? Package { get; set; }
        
        public List<Order> Orders { get; set; } = new();
        public List<UserFilmList> UserFilmLists { get; set; } = new();
    }
    
    public enum UserRole
    {
        Customer = 1,
        Admin = 2,
        Coordinator = 3,
        Accountant = 4,
        Warehouse = 5,
        Courier = 6,
        FilmEntry = 7
    }
} 