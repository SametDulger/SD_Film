using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IFilmService
    {
        Task<ApiResponse<List<FilmDto>>> GetAllAsync(int page = 1, int pageSize = 10);
        Task<ApiResponse<FilmDto>> GetByIdAsync(int id);
        Task<ApiResponse<FilmDto>> GetByBarcodeAsync(string barcode);
        Task<ApiResponse<List<FilmDto>>> GetByCategoryAsync(int categoryId, int page = 1, int pageSize = 10);
        Task<ApiResponse<List<FilmDto>>> SearchAsync(string searchTerm, int page = 1, int pageSize = 10);
        Task<ApiResponse<List<FilmDto>>> GetNewReleasesAsync(int page = 1, int pageSize = 10);
        Task<ApiResponse<List<FilmDto>>> GetEditorChoicesAsync(int page = 1, int pageSize = 10);
        Task<ApiResponse<List<FilmDto>>> GetMostRentedAsync(int page = 1, int pageSize = 10);
        Task<ApiResponse<FilmDto>> CreateAsync(CreateFilmDto createFilmDto);
        Task<ApiResponse<FilmDto>> UpdateAsync(int id, UpdateFilmDto updateFilmDto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<bool>> UpdateStockAsync(int id, int newStockCount);
    }
} 