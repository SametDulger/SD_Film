using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class OrderService : IOrderService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<OrderDto>>> GetAllAsync()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Courier)
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Film)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                var orderDtos = _mapper.Map<List<OrderDto>>(orders);
                return ApiResponse<List<OrderDto>>.SuccessResult(orderDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<OrderDto>>.ErrorResult($"Siparişler getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<OrderDto>> GetByIdAsync(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Courier)
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Film)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return ApiResponse<OrderDto>.ErrorResult("Sipariş bulunamadı");

                var orderDto = _mapper.Map<OrderDto>(order);
                return ApiResponse<OrderDto>.SuccessResult(orderDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderDto>.ErrorResult($"Sipariş getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Courier)
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Film)
                    .Where(o => o.UserId == userId)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                var orderDtos = _mapper.Map<List<OrderDto>>(orders);
                return ApiResponse<List<OrderDto>>.SuccessResult(orderDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<OrderDto>>.ErrorResult($"Kullanıcı siparişleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<OrderDto>> CreateAsync(CreateOrderDto createOrderDto)
        {
            try
            {
                var order = new Order
                {
                    UserId = createOrderDto.UserId,
                    OrderDate = DateTime.Now,
                    Status = "Pending",
                    DeliveryAddress = createOrderDto.DeliveryAddress,
                    Notes = createOrderDto.Notes,
                    CreatedDate = DateTime.Now
                };

                decimal totalAmount = 0;

                foreach (var detail in createOrderDto.OrderDetails)
                {
                    var film = await _context.Films.FindAsync(detail.FilmId);
                    if (film == null)
                        return ApiResponse<OrderDto>.ErrorResult($"Film bulunamadı: {detail.FilmId}");

                    var orderDetail = new OrderDetail
                    {
                        FilmId = detail.FilmId,
                        Quantity = detail.Quantity,
                        UnitPrice = film.Price,
                        TotalPrice = film.Price * detail.Quantity,
                        CreatedDate = DateTime.Now
                    };

                    order.OrderDetails.Add(orderDetail);
                    totalAmount += orderDetail.TotalPrice;
                }

                order.TotalAmount = totalAmount;

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                var orderDto = await GetOrderDtoWithDetails(order.Id);
                return ApiResponse<OrderDto>.SuccessResult(orderDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderDto>.ErrorResult($"Sipariş oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<OrderDto>> UpdateAsync(int id, UpdateOrderDto updateOrderDto)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return ApiResponse<OrderDto>.ErrorResult("Sipariş bulunamadı");

                _mapper.Map(updateOrderDto, order);
                order.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var orderDto = await GetOrderDtoWithDetails(order.Id);
                return ApiResponse<OrderDto>.SuccessResult(orderDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderDto>.ErrorResult($"Sipariş güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return ApiResponse<bool>.ErrorResult("Sipariş bulunamadı");

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Sipariş silinirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<OrderDto>>> GetByUserIdAsync(int userId)
        {
            return await GetUserOrdersAsync(userId);
        }

        public async Task<ApiResponse<List<OrderDto>>> GetByStatusAsync(string status)
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Courier)
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Film)
                    .Where(o => o.Status == status)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                var orderDtos = _mapper.Map<List<OrderDto>>(orders);
                return ApiResponse<List<OrderDto>>.SuccessResult(orderDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<OrderDto>>.ErrorResult($"Durum bazlı siparişler getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> AssignCourierAsync(int orderId, int courierId)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    return ApiResponse<bool>.ErrorResult("Sipariş bulunamadı");

                var courier = await _context.Users.FirstOrDefaultAsync(u => u.Id == courierId && u.Role == "Courier");
                if (courier == null)
                    return ApiResponse<bool>.ErrorResult("Kurye bulunamadı");

                order.CourierId = courierId;
                order.Status = "Assigned";
                order.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Kurye atanırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateStatusAsync(int orderId, string status)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    return ApiResponse<bool>.ErrorResult("Sipariş bulunamadı");

                order.Status = status;
                order.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Sipariş durumu güncellenirken hata oluştu: {ex.Message}");
            }
        }

        private async Task<OrderDto> GetOrderDtoWithDetails(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Courier)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Film)
                .FirstOrDefaultAsync(o => o.Id == id);

            return _mapper.Map<OrderDto>(order);
        }
    }
} 