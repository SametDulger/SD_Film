using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IFilmService
    {
        Task<ApiResponse<List<FilmDto>>> GetAllAsync();
        Task<ApiResponse<FilmDto>> GetByIdAsync(int id);
        Task<ApiResponse<List<FilmDto>>> GetByCategoryAsync(int categoryId);
        Task<ApiResponse<List<FilmDto>>> SearchAsync(string searchTerm);
        Task<ApiResponse<List<FilmDto>>> GetNewReleasesAsync();
        Task<ApiResponse<List<FilmDto>>> GetEditorChoicesAsync();
        Task<ApiResponse<List<FilmDto>>> GetMostRentedAsync();
        Task<ApiResponse<FilmDto>> CreateAsync(CreateFilmDto createFilmDto);
        Task<ApiResponse<FilmDto>> UpdateAsync(int id, UpdateFilmDto updateFilmDto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<bool>> UpdateStockAsync(int id, int newStockCount);
    }
} 