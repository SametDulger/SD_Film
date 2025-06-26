using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IOrderService
    {
        Task<ApiResponse<List<OrderDto>>> GetAllAsync();
        Task<ApiResponse<OrderDto>> GetByIdAsync(int id);
        Task<ApiResponse<List<OrderDto>>> GetByUserIdAsync(int userId);
        Task<ApiResponse<List<OrderDto>>> GetByStatusAsync(string status);
        Task<ApiResponse<OrderDto>> CreateAsync(CreateOrderDto createOrderDto);
        Task<ApiResponse<OrderDto>> UpdateAsync(int id, UpdateOrderDto updateOrderDto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<bool>> AssignCourierAsync(int orderId, int courierId);
        Task<ApiResponse<bool>> UpdateStatusAsync(int orderId, string status);
        Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId);
    }
} 