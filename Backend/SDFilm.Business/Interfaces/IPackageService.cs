using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IPackageService
    {
        Task<ApiResponse<List<PackageDto>>> GetAllAsync();
        Task<ApiResponse<PackageDto>> GetByIdAsync(int id);
        Task<ApiResponse<PackageDto>> CreateAsync(CreatePackageDto createPackageDto);
        Task<ApiResponse<PackageDto>> UpdateAsync(int id, UpdatePackageDto updatePackageDto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
} 