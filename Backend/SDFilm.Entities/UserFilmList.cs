using System.ComponentModel.DataAnnotations;

namespace SDFilm.Entities
{
    public class UserFilmList : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required]
        public int FilmId { get; set; }
        public Film Film { get; set; } = null!;
        
        [Required]
        public DateTime AddedDate { get; set; }
        
        public bool IsWatched { get; set; } = false;
        
        public int? Rating { get; set; }
        
        [MaxLength(1000)]
        public string? Review { get; set; }
    }
} 