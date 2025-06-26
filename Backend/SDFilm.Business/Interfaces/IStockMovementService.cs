using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IStockMovementService
    {
        Task<ApiResponse<List<StockMovementDto>>> GetAllAsync();
        Task<ApiResponse<List<StockMovementDto>>> GetByFilmIdAsync(int filmId);
        Task<ApiResponse<StockMovementDto>> CreateAsync(CreateStockMovementDto dto);
    }
} 