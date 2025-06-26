namespace SDFilm.Core.DTOs
{
    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FilmId { get; set; }
        public string FilmTitle { get; set; } = string.Empty;
        public string FilmDirector { get; set; } = string.Empty;
        public decimal FilmPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime AddedDate { get; set; }
    }

    public class CreateCartDto
    {
        public int FilmId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    public class UpdateCartDto
    {
        public int Quantity { get; set; }
    }

    public class CartSummaryDto
    {
        public int TotalItems { get; set; }
        public decimal TotalAmount { get; set; }
        public List<CartDto> Items { get; set; } = new List<CartDto>();
    }
} 