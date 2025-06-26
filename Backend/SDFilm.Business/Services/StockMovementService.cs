using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class StockMovementService : IStockMovementService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public StockMovementService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<StockMovementDto>>> GetAllAsync()
        {
            try
            {
                var movements = await _context.StockMovements.Include(sm => sm.Film).OrderByDescending(sm => sm.CreatedDate).ToListAsync();
                var dtos = movements.Select(sm => new StockMovementDto
                {
                    Id = sm.Id,
                    FilmId = sm.FilmId,
                    FilmTitle = sm.Film.Title,
                    MovementType = sm.MovementType,
                    Quantity = sm.Quantity,
                    Date = sm.CreatedDate,
                    Notes = sm.Notes
                }).ToList();
                return ApiResponse<List<StockMovementDto>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<StockMovementDto>>.ErrorResult($"Stok hareketleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<StockMovementDto>>> GetByFilmIdAsync(int filmId)
        {
            try
            {
                var movements = await _context.StockMovements.Include(sm => sm.Film).Where(sm => sm.FilmId == filmId).OrderByDescending(sm => sm.CreatedDate).ToListAsync();
                var dtos = movements.Select(sm => new StockMovementDto
                {
                    Id = sm.Id,
                    FilmId = sm.FilmId,
                    FilmTitle = sm.Film.Title,
                    MovementType = sm.MovementType,
                    Quantity = sm.Quantity,
                    Date = sm.CreatedDate,
                    Notes = sm.Notes
                }).ToList();
                return ApiResponse<List<StockMovementDto>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<StockMovementDto>>.ErrorResult($"Stok hareketleri getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<StockMovementDto>> CreateAsync(CreateStockMovementDto dto)
        {
            try
            {
                var film = await _context.Films.FindAsync(dto.FilmId);
                if (film == null)
                    return ApiResponse<StockMovementDto>.ErrorResult("Film bulunamadı");

                // Stok çıkarma işleminde negatif değer kontrolü
                if (dto.MovementType == "Out" && film.StockCount < dto.Quantity)
                    return ApiResponse<StockMovementDto>.ErrorResult($"Yetersiz stok. Mevcut stok: {film.StockCount}, Çıkarılmak istenen: {dto.Quantity}");

                var movement = new StockMovement
                {
                    FilmId = dto.FilmId,
                    MovementType = dto.MovementType,
                    Quantity = dto.Quantity,
                    Notes = dto.Notes,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                };
                _context.StockMovements.Add(movement);

                // Stok güncelle
                if (dto.MovementType == "In")
                    film.StockCount += dto.Quantity;
                else if (dto.MovementType == "Out")
                    film.StockCount -= dto.Quantity;

                await _context.SaveChangesAsync();

                var resultDto = new StockMovementDto
                {
                    Id = movement.Id,
                    FilmId = movement.FilmId,
                    FilmTitle = film.Title,
                    MovementType = movement.MovementType,
                    Quantity = movement.Quantity,
                    Date = movement.CreatedDate,
                    Notes = movement.Notes
                };
                return ApiResponse<StockMovementDto>.SuccessResult(resultDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<StockMovementDto>.ErrorResult($"Stok hareketi eklenirken hata oluştu: {ex.Message}");
            }
        }
    }
} 