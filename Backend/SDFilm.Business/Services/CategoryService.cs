using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public CategoryService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<CategoryDto>>> GetAllAsync()
        {
            try
            {
                var categories = await _context.Categories
                    .Include(c => c.Films)
                    .ToListAsync();

                var categoryDtos = _mapper.Map<List<CategoryDto>>(categories);
                return ApiResponse<List<CategoryDto>>.SuccessResult(categoryDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<CategoryDto>>.ErrorResult($"Kategoriler getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Films)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                    return ApiResponse<CategoryDto>.ErrorResult("Kategori bulunamadı");

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return ApiResponse<CategoryDto>.SuccessResult(categoryDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<CategoryDto>.ErrorResult($"Kategori getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto createCategoryDto)
        {
            try
            {
                var category = _mapper.Map<Category>(createCategoryDto);
                category.CreatedDate = DateTime.Now;

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return ApiResponse<CategoryDto>.SuccessResult(categoryDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<CategoryDto>.ErrorResult($"Kategori oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                    return ApiResponse<CategoryDto>.ErrorResult("Kategori bulunamadı");

                _mapper.Map(updateCategoryDto, category);
                category.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return ApiResponse<CategoryDto>.SuccessResult(categoryDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<CategoryDto>.ErrorResult($"Kategori güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                    return ApiResponse<bool>.ErrorResult("Kategori bulunamadı");

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Kategori silinirken hata oluştu: {ex.Message}");
            }
        }
    }
} 