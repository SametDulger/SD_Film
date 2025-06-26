namespace SDFilm.Core.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public int? CourierId { get; set; }
        public string CourierName { get; set; } = string.Empty;
        public List<OrderDetailDto> OrderDetails { get; set; } = new();
    }

    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public string DeliveryAddress { get; set; }
        public string Notes { get; set; }
        public List<CreateOrderDetailDto> OrderDetails { get; set; } = new();
    }

    public class UpdateOrderDto
    {
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }

    public class OrderDetailDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int FilmId { get; set; }
        public string FilmTitle { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CreateOrderDetailDto
    {
        public int FilmId { get; set; }
        public int Quantity { get; set; }
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