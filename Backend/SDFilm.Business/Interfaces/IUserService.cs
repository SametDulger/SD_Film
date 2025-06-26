using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<List<UserDto>>> GetAllAsync();
        Task<ApiResponse<UserDto>> GetByIdAsync(int id);
        Task<ApiResponse<UserDto>> GetByEmailAsync(string email);
        Task<ApiResponse<List<UserDto>>> GetByRoleAsync(string role);
        Task<ApiResponse<UserDto>> CreateAsync(CreateUserDto createUserDto);
        Task<ApiResponse<UserDto>> UpdateAsync(int id, UpdateUserDto updateUserDto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<string>> LoginAsync(LoginDto loginDto);
        Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }
} 