using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class UserPackageService : IUserPackageService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public UserPackageService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<UserPackageDto>>> GetAllAsync()
        {
            try
            {
                var userPackages = await _context.UserPackages
                    .Include(up => up.User)
                    .Include(up => up.Package)
                    .OrderByDescending(up => up.CreatedDate)
                    .ToListAsync();

                var userPackageDtos = _mapper.Map<List<UserPackageDto>>(userPackages);
                return ApiResponse<List<UserPackageDto>>.SuccessResult(userPackageDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserPackageDto>>.ErrorResult($"Kullanıcı paketleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserPackageDto>> GetByIdAsync(int id)
        {
            try
            {
                var userPackage = await _context.UserPackages
                    .Include(up => up.User)
                    .Include(up => up.Package)
                    .FirstOrDefaultAsync(up => up.Id == id);

                if (userPackage == null)
                    return ApiResponse<UserPackageDto>.ErrorResult("Kullanıcı paketi bulunamadı");

                var userPackageDto = _mapper.Map<UserPackageDto>(userPackage);
                return ApiResponse<UserPackageDto>.SuccessResult(userPackageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserPackageDto>.ErrorResult($"Kullanıcı paketi getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserPackageDto>>> GetByUserIdAsync(int userId)
        {
            try
            {
                var userPackages = await _context.UserPackages
                    .Include(up => up.User)
                    .Include(up => up.Package)
                    .Where(up => up.UserId == userId)
                    .OrderByDescending(up => up.CreatedDate)
                    .ToListAsync();

                var userPackageDtos = _mapper.Map<List<UserPackageDto>>(userPackages);
                return ApiResponse<List<UserPackageDto>>.SuccessResult(userPackageDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserPackageDto>>.ErrorResult($"Kullanıcı paketleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserPackageDto>> CreateAsync(CreateUserPackageDto dto)
        {
            try
            {
                var userPackage = _mapper.Map<UserPackage>(dto);
                userPackage.CreatedDate = DateTime.Now;
                userPackage.IsActive = true;

                _context.UserPackages.Add(userPackage);
                await _context.SaveChangesAsync();

                var userPackageDto = await GetUserPackageDtoWithDetails(userPackage.Id);
                return ApiResponse<UserPackageDto>.SuccessResult(userPackageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserPackageDto>.ErrorResult($"Kullanıcı paketi oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserPackageDto>> UpdateAsync(int id, UpdateUserPackageDto dto)
        {
            try
            {
                var userPackage = await _context.UserPackages.FindAsync(id);
                if (userPackage == null)
                    return ApiResponse<UserPackageDto>.ErrorResult("Kullanıcı paketi bulunamadı");

                _mapper.Map(dto, userPackage);
                userPackage.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var userPackageDto = await GetUserPackageDtoWithDetails(userPackage.Id);
                return ApiResponse<UserPackageDto>.SuccessResult(userPackageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserPackageDto>.ErrorResult($"Kullanıcı paketi güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var userPackage = await _context.UserPackages.FindAsync(id);
                if (userPackage == null)
                    return ApiResponse<bool>.ErrorResult("Kullanıcı paketi bulunamadı");

                _context.UserPackages.Remove(userPackage);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Kullanıcı paketi silinirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserPackageDto>> PurchasePackageAsync(int userId, int packageId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return ApiResponse<UserPackageDto>.ErrorResult("Kullanıcı bulunamadı");

                var package = await _context.Packages.FindAsync(packageId);
                if (package == null)
                    return ApiResponse<UserPackageDto>.ErrorResult("Paket bulunamadı");

                if (!package.IsActive)
                    return ApiResponse<UserPackageDto>.ErrorResult("Paket aktif değil");

                var userPackage = new UserPackage
                {
                    UserId = userId,
                    PackageId = packageId,
                    PurchaseDate = DateTime.Now,
                    ExpiryDate = DateTime.Now.AddMonths(1),
                    RemainingFilms = package.FilmCount,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.UserPackages.Add(userPackage);
                await _context.SaveChangesAsync();

                var userPackageDto = await GetUserPackageDtoWithDetails(userPackage.Id);
                return ApiResponse<UserPackageDto>.SuccessResult(userPackageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserPackageDto>.ErrorResult($"Paket satın alınırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UseFilmFromPackageAsync(int userId)
        {
            try
            {
                var activePackage = await _context.UserPackages
                    .Include(up => up.Package)
                    .Where(up => up.UserId == userId && up.IsActive && up.RemainingFilms > 0 && up.ExpiryDate > DateTime.Now)
                    .OrderBy(up => up.ExpiryDate)
                    .FirstOrDefaultAsync();

                if (activePackage == null)
                    return ApiResponse<bool>.ErrorResult("Aktif paket bulunamadı");

                activePackage.RemainingFilms--;
                activePackage.UpdatedDate = DateTime.Now;

                if (activePackage.RemainingFilms == 0)
                    activePackage.IsActive = false;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Paket kullanılırken hata oluştu: {ex.Message}");
            }
        }

        private async Task<UserPackageDto> GetUserPackageDtoWithDetails(int id)
        {
            var userPackage = await _context.UserPackages
                .Include(up => up.User)
                .Include(up => up.Package)
                .FirstOrDefaultAsync(up => up.Id == id);

            return _mapper.Map<UserPackageDto>(userPackage);
        }
    }
} 