using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class FilmService : IFilmService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public FilmService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<FilmDto>>> GetAllAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var totalCount = await _context.Films.CountAsync();
                var films = await _context.Films
                    .Include(f => f.Category)
                    .OrderByDescending(f => f.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                var pagination = new PaginationInfo(page, pageSize, totalCount);
                
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos, pagination);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Filmler getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<FilmDto>> GetByIdAsync(int id)
        {
            try
            {
                var film = await _context.Films
                    .Include(f => f.Category)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (film == null)
                    return ApiResponse<FilmDto>.ErrorResult("Film bulunamadı");

                var filmDto = _mapper.Map<FilmDto>(film);
                return ApiResponse<FilmDto>.SuccessResult(filmDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<FilmDto>.ErrorResult($"Film getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<FilmDto>> GetByBarcodeAsync(string barcode)
        {
            try
            {
                var film = await _context.Films
                    .Include(f => f.Category)
                    .FirstOrDefaultAsync(f => f.Barcode == barcode);

                if (film == null)
                    return ApiResponse<FilmDto>.ErrorResult("Film bulunamadı");

                var filmDto = _mapper.Map<FilmDto>(film);
                return ApiResponse<FilmDto>.SuccessResult(filmDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<FilmDto>.ErrorResult($"Film getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetByCategoryAsync(int categoryId, int page = 1, int pageSize = 10)
        {
            try
            {
                var totalCount = await _context.Films.CountAsync(f => f.CategoryId == categoryId);
                var films = await _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.CategoryId == categoryId)
                    .OrderByDescending(f => f.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                var pagination = new PaginationInfo(page, pageSize, totalCount);
                
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos, pagination);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Kategori filmleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> SearchAsync(string searchTerm, int page = 1, int pageSize = 10)
        {
            try
            {
                var query = _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.Title.Contains(searchTerm) || 
                               f.Description.Contains(searchTerm) || 
                               f.Director.Contains(searchTerm) || 
                               f.Cast.Contains(searchTerm));

                var totalCount = await query.CountAsync();
                var films = await query
                    .OrderByDescending(f => f.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                var pagination = new PaginationInfo(page, pageSize, totalCount);
                
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos, pagination);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Film arama yapılırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetNewReleasesAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var query = _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.IsNewRelease && f.IsActive);

                var totalCount = await query.CountAsync();
                var films = await query
                    .OrderByDescending(f => f.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                var pagination = new PaginationInfo(page, pageSize, totalCount);
                
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos, pagination);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Yeni çıkanlar getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetEditorChoicesAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var query = _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.IsEditorChoice && f.IsActive);

                var totalCount = await query.CountAsync();
                var films = await query
                    .OrderByDescending(f => f.CreatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                var pagination = new PaginationInfo(page, pageSize, totalCount);
                
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos, pagination);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Editör seçimleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetMostRentedAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var query = _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.IsActive)
                    .OrderByDescending(f => f.RentalCount);

                var totalCount = await query.CountAsync();
                var films = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                var pagination = new PaginationInfo(page, pageSize, totalCount);
                
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos, pagination);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"En çok kiralananlar getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<FilmDto>> CreateAsync(CreateFilmDto createFilmDto)
        {
            try
            {
                var film = _mapper.Map<Film>(createFilmDto);
                film.CreatedDate = DateTime.Now;
                film.IsActive = true;

                if (string.IsNullOrEmpty(film.Barcode))
                {
                    film.Barcode = GenerateBarcode();
                }

                _context.Films.Add(film);
                await _context.SaveChangesAsync();

                var filmDto = await GetFilmDtoWithCategory(film.Id);
                return ApiResponse<FilmDto>.SuccessResult(filmDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<FilmDto>.ErrorResult($"Film oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<FilmDto>> UpdateAsync(int id, UpdateFilmDto updateFilmDto)
        {
            try
            {
                var film = await _context.Films.FindAsync(id);
                if (film == null)
                    return ApiResponse<FilmDto>.ErrorResult("Film bulunamadı");

                _mapper.Map(updateFilmDto, film);
                film.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var filmDto = await GetFilmDtoWithCategory(film.Id);
                return ApiResponse<FilmDto>.SuccessResult(filmDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<FilmDto>.ErrorResult($"Film güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var film = await _context.Films.FindAsync(id);
                if (film == null)
                    return ApiResponse<bool>.ErrorResult("Film bulunamadı");

                // Soft delete - set IsActive to false instead of removing
                film.IsActive = false;
                film.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Film silinirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateStockAsync(int id, int newStockCount)
        {
            try
            {
                var film = await _context.Films.FindAsync(id);
                if (film == null)
                    return ApiResponse<bool>.ErrorResult("Film bulunamadı");

                if (newStockCount < 0)
                    return ApiResponse<bool>.ErrorResult("Stok miktarı negatif olamaz");

                film.StockCount = newStockCount;
                film.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Stok güncellenirken hata oluştu: {ex.Message}");
            }
        }

        private async Task<FilmDto> GetFilmDtoWithCategory(int id)
        {
            var film = await _context.Films
                .Include(f => f.Category)
                .FirstOrDefaultAsync(f => f.Id == id);

            return _mapper.Map<FilmDto>(film);
        }

        private string GenerateBarcode()
        {
            var random = new Random();
            var barcode = "SD" + DateTime.Now.ToString("yyyyMMdd") + random.Next(1000, 9999).ToString();
            return barcode;
        }
    }
} 