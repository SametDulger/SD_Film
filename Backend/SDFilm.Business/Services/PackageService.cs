using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class PackageService : IPackageService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public PackageService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<PackageDto>>> GetAllAsync()
        {
            try
            {
                var packages = await _context.Packages
                    .ToListAsync();

                var packageDtos = _mapper.Map<List<PackageDto>>(packages);
                return ApiResponse<List<PackageDto>>.SuccessResult(packageDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PackageDto>>.ErrorResult($"Paketler getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PackageDto>> GetByIdAsync(int id)
        {
            try
            {
                var package = await _context.Packages
                    .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

                if (package == null)
                    return ApiResponse<PackageDto>.ErrorResult("Paket bulunamadı");

                var packageDto = _mapper.Map<PackageDto>(package);
                return ApiResponse<PackageDto>.SuccessResult(packageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<PackageDto>.ErrorResult($"Paket getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PackageDto>> CreateAsync(CreatePackageDto createPackageDto)
        {
            try
            {
                var package = _mapper.Map<Package>(createPackageDto);
                package.CreatedDate = DateTime.Now;

                _context.Packages.Add(package);
                await _context.SaveChangesAsync();

                var packageDto = _mapper.Map<PackageDto>(package);
                return ApiResponse<PackageDto>.SuccessResult(packageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<PackageDto>.ErrorResult($"Paket oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PackageDto>> UpdateAsync(int id, UpdatePackageDto updatePackageDto)
        {
            try
            {
                var package = await _context.Packages.FindAsync(id);
                if (package == null)
                    return ApiResponse<PackageDto>.ErrorResult("Paket bulunamadı");

                _mapper.Map(updatePackageDto, package);
                package.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var packageDto = _mapper.Map<PackageDto>(package);
                return ApiResponse<PackageDto>.SuccessResult(packageDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<PackageDto>.ErrorResult($"Paket güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var package = await _context.Packages.FindAsync(id);
                if (package == null)
                    return ApiResponse<bool>.ErrorResult("Paket bulunamadı");

                package.IsActive = false;
                package.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Paket silinirken hata oluştu: {ex.Message}");
            }
        }
    }
} 