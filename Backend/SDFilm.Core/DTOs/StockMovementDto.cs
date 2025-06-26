namespace SDFilm.Core.DTOs
{
    public class StockMovementDto
    {
        public int Id { get; set; }
        public int FilmId { get; set; }
        public string FilmTitle { get; set; } = string.Empty;
        public string MovementType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateStockMovementDto
    {
        public int FilmId { get; set; }
        public string MovementType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Notes { get; set; }
    }
} 