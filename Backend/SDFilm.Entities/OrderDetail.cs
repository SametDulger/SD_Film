using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDFilm.Entities
{
    public class OrderDetail : BaseEntity
    {
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        
        [Required]
        public int FilmId { get; set; }
        public Film Film { get; set; } = null!;
        
        [Required]
        public int Quantity { get; set; } = 1;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
    }
} 