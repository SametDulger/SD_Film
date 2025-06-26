using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface ICartService
    {
        Task<ApiResponse<CartSummaryDto>> GetUserCartAsync(int userId);
        Task<ApiResponse<CartDto>> AddToCartAsync(int userId, CreateCartDto createCartDto);
        Task<ApiResponse<CartDto>> UpdateCartItemAsync(int cartItemId, UpdateCartDto updateCartDto);
        Task<ApiResponse<bool>> RemoveFromCartAsync(int cartItemId);
        Task<ApiResponse<bool>> ClearCartAsync(int userId);
        Task<ApiResponse<bool>> CheckoutAsync(int userId, string deliveryAddress);
    }
} 