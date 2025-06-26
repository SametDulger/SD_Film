using System.ComponentModel.DataAnnotations;

namespace SDFilm.Entities
{
    public class Cart : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required]
        public int FilmId { get; set; }
        public Film Film { get; set; } = null!;
        
        [Required]
        public int Quantity { get; set; } = 1;
        
        public DateTime AddedDate { get; set; } = DateTime.Now;
    }
} 