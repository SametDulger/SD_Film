namespace SDFilm.Core.DTOs
{
    public class PackageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int FilmCount { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreatePackageDto
    {
        public string Name { get; set; } = string.Empty;
        public int FilmCount { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class UpdatePackageDto
    {
        public string Name { get; set; } = string.Empty;
        public int FilmCount { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
} 