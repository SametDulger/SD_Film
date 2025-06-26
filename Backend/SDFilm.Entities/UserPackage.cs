using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDFilm.Entities
{
    public class UserPackage : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        public int PackageId { get; set; }
        public Package Package { get; set; } = null!;

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public int RemainingFilms { get; set; }

        public bool IsActive { get; set; } = true;
    }
} 