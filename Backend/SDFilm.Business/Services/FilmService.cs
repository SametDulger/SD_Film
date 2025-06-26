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

        public async Task<ApiResponse<List<FilmDto>>> GetAllAsync()
        {
            try
            {
                var films = await _context.Films
                    .Include(f => f.Category)
                    .OrderByDescending(f => f.CreatedDate)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos);
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
                if (film.Category == null)
                    return ApiResponse<FilmDto>.ErrorResult("Film kategorisi bulunamadı");

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

                if (film == null || film.Category == null)
                    return ApiResponse<FilmDto>.ErrorResult("Film veya kategorisi bulunamadı");

                var filmDto = _mapper.Map<FilmDto>(film);
                return ApiResponse<FilmDto>.SuccessResult(filmDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<FilmDto>.ErrorResult($"Film getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetByCategoryAsync(int categoryId)
        {
            try
            {
                var films = await _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.CategoryId == categoryId)
                    .OrderByDescending(f => f.CreatedDate)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Kategori filmleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> SearchAsync(string searchTerm)
        {
            try
            {
                var films = await _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.Title.Contains(searchTerm) || 
                               f.Description.Contains(searchTerm) || 
                               f.Director.Contains(searchTerm) || 
                               f.Cast.Contains(searchTerm))
                    .OrderByDescending(f => f.CreatedDate)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult($"Film arama yapılırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetNewReleasesAsync()
        {
            try
            {
                var films = await _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.IsNewRelease && f.IsActive)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult("Yeni çıkanlar getirilirken hata oluştu", new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetEditorChoicesAsync()
        {
            try
            {
                var films = await _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.IsEditorChoice && f.IsActive)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult("Editör seçimleri getirilirken hata oluştu", new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<List<FilmDto>>> GetMostRentedAsync()
        {
            try
            {
                var films = await _context.Films
                    .Include(f => f.Category)
                    .Where(f => f.IsActive)
                    .OrderByDescending(f => f.RentalCount)
                    .Take(10)
                    .ToListAsync();

                var filmDtos = _mapper.Map<List<FilmDto>>(films);
                return ApiResponse<List<FilmDto>>.SuccessResult(filmDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmDto>>.ErrorResult("En çok kiralananlar getirilirken hata oluştu", new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<FilmDto>> CreateAsync(CreateFilmDto createFilmDto)
        {
            try
            {
                var film = _mapper.Map<Film>(createFilmDto);
                film.CreatedDate = DateTime.Now;

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

                _context.Films.Remove(film);
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