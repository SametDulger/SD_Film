namespace SDFilm.Core.DTOs
{
    public class FilmDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Actors { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Audio { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsNewRelease { get; set; }
        public bool IsEditorChoice { get; set; }
        public int RentalCount { get; set; }
        public int StockCount { get; set; }
        public string ShelfLocation { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class CreateFilmDto
    {
        public string Title { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Actors { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Audio { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public bool IsNewRelease { get; set; }
        public bool IsEditorChoice { get; set; }
        public int StockCount { get; set; }
        public string ShelfLocation { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class UpdateFilmDto
    {
        public string Title { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Actors { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Audio { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public bool IsNewRelease { get; set; }
        public bool IsEditorChoice { get; set; }
        public int StockCount { get; set; }
        public string ShelfLocation { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
} 