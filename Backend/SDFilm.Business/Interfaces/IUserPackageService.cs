using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IUserPackageService
    {
        Task<ApiResponse<List<UserPackageDto>>> GetAllAsync();
        Task<ApiResponse<UserPackageDto>> GetByIdAsync(int id);
        Task<ApiResponse<List<UserPackageDto>>> GetByUserIdAsync(int userId);
        Task<ApiResponse<UserPackageDto>> CreateAsync(CreateUserPackageDto dto);
        Task<ApiResponse<UserPackageDto>> UpdateAsync(int id, UpdateUserPackageDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<UserPackageDto>> PurchasePackageAsync(int userId, int packageId);
        Task<ApiResponse<bool>> UseFilmFromPackageAsync(int userId);
    }
} 