using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SDFilm.Entities
{
    public class StockMovement : BaseEntity
    {
        [Required]
        public int FilmId { get; set; }
        public Film Film { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string MovementType { get; set; } = string.Empty; // In, Out

        [Required]
        public int Quantity { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }
} 