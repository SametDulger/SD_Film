using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Core.DTOs;
using SDFilm.Business.Interfaces;
using SDFilm.DataAccess;
using SDFilm.Entities;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SDFilm.Business.Services
{
    public class UserService : IUserService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserService(SDFilmDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<ApiResponse<List<UserDto>>> GetAllAsync()
        {
            try
            {
                var users = await _context.Users
                    .OrderByDescending(u => u.CreatedDate)
                    .ToListAsync();

                var userDtos = _mapper.Map<List<UserDto>>(users);
                return ApiResponse<List<UserDto>>.SuccessResult(userDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserDto>>.ErrorResult($"Kullanıcılar getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserDto>> GetByIdAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return ApiResponse<UserDto>.ErrorResult("Kullanıcı bulunamadı");

                var userDto = _mapper.Map<UserDto>(user);
                return ApiResponse<UserDto>.SuccessResult(userDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserDto>.ErrorResult($"Kullanıcı getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserDto>> GetByEmailAsync(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                    return ApiResponse<UserDto>.ErrorResult("Kullanıcı bulunamadı");

                var userDto = _mapper.Map<UserDto>(user);
                return ApiResponse<UserDto>.SuccessResult(userDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserDto>.ErrorResult($"Kullanıcı getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserDto>>> GetByRoleAsync(string role)
        {
            try
            {
                var users = await _context.Users
                    .Where(u => u.Role == role)
                    .OrderByDescending(u => u.CreatedDate)
                    .ToListAsync();

                var userDtos = _mapper.Map<List<UserDto>>(users);
                return ApiResponse<List<UserDto>>.SuccessResult(userDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserDto>>.ErrorResult($"Kullanıcılar getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserDto>> CreateAsync(CreateUserDto createUserDto)
        {
            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == createUserDto.Email);
                if (existingUser != null)
                    return ApiResponse<UserDto>.ErrorResult("Bu email adresi zaten kullanılıyor");

                var user = _mapper.Map<User>(createUserDto);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);
                user.CreatedDate = DateTime.Now;
                user.IsActive = true;

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var userDto = _mapper.Map<UserDto>(user);
                return ApiResponse<UserDto>.SuccessResult(userDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserDto>.ErrorResult($"Kullanıcı oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserDto>> UpdateAsync(int id, UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return ApiResponse<UserDto>.ErrorResult("Kullanıcı bulunamadı");

                _mapper.Map(updateUserDto, user);
                user.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var userDto = _mapper.Map<UserDto>(user);
                return ApiResponse<UserDto>.SuccessResult(userDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserDto>.ErrorResult($"Kullanıcı güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return ApiResponse<bool>.ErrorResult("Kullanıcı bulunamadı");

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Kullanıcı silinirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (user == null)
                    return ApiResponse<string>.ErrorResult("Geçersiz email veya şifre");

                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                    return ApiResponse<string>.ErrorResult("Geçersiz email veya şifre");

                if (!user.IsActive)
                    return ApiResponse<string>.ErrorResult("Hesabınız aktif değil");

                var token = GenerateJwtToken(user);
                return ApiResponse<string>.SuccessResult(token);
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResult($"Giriş yapılırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return ApiResponse<bool>.ErrorResult("Kullanıcı bulunamadı");

                if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                    return ApiResponse<bool>.ErrorResult("Mevcut şifre yanlış");

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                user.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Şifre değiştirilirken hata oluştu: {ex.Message}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            if (string.IsNullOrEmpty(jwtSettings["Key"]))
                throw new ArgumentNullException("JWT key is missing in configuration");
            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                signingCredentials: new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 