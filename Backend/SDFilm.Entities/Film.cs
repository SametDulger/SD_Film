using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDFilm.Entities
{
    public class Film : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Director { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Cast { get; set; }
        
        public int ReleaseYear { get; set; }
        
        [MaxLength(50)]
        public string? Barcode { get; set; }
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        [StringLength(50)]
        public string? Language { get; set; }
        
        [StringLength(50)]
        public string? Subtitle { get; set; }
        
        [StringLength(50)]
        public string? Audio { get; set; }
        
        public bool IsNewRelease { get; set; }
        
        public bool IsEditorChoice { get; set; }
        
        public int RentalCount { get; set; }
        
        public int StockCount { get; set; }
        
        public string? ShelfLocation { get; set; }
        
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public virtual ICollection<UserFilmList> UserFilmLists { get; set; } = new List<UserFilmList>();
    }
} 