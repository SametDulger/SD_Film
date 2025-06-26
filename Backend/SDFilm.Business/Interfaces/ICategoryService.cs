using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<List<CategoryDto>>> GetAllAsync();
        Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
        Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto createCategoryDto);
        Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto updateCategoryDto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
} 