using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IUserFilmListService
    {
        Task<ApiResponse<List<UserFilmListDto>>> GetUserFilmListAsync(int userId);
        Task<ApiResponse<UserFilmListDto>> AddToUserListAsync(CreateUserFilmListDto createUserFilmListDto);
        Task<ApiResponse<UserFilmListDto>> UpdateUserFilmAsync(int id, UpdateUserFilmListDto updateUserFilmListDto);
        Task<ApiResponse<bool>> RemoveFromUserListAsync(int id);
        Task<ApiResponse<List<UserFilmListDto>>> GetWatchedFilmsAsync(int userId);
        Task<ApiResponse<List<UserFilmListDto>>> GetWishlistAsync(int userId);
    }
} 