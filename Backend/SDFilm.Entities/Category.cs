using System.ComponentModel.DataAnnotations;

namespace SDFilm.Entities
{
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public List<Film> Films { get; set; } = new();
    }
} 