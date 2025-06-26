using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDFilm.Entities
{
    public class Order : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required]
        public DateTime OrderDate { get; set; } = DateTime.Now;
        
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";
        
        [Required]
        [MaxLength(500)]
        public string DeliveryAddress { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        public int? CourierId { get; set; }
        public User? Courier { get; set; }
        
        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
    
    public enum OrderStatus
    {
        Pending = 1,
        Confirmed = 2,
        InDelivery = 3,
        Delivered = 4,
        Returned = 5,
        Cancelled = 6
    }
} 