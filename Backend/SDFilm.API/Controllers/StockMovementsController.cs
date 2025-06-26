using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "WarehousePolicy")]
    public class StockMovementsController : ControllerBase
    {
        private readonly IStockMovementService _stockMovementService;

        public StockMovementsController(IStockMovementService stockMovementService)
        {
            _stockMovementService = stockMovementService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _stockMovementService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("film/{filmId}")]
        public async Task<IActionResult> GetByFilmId(int filmId)
        {
            var result = await _stockMovementService.GetByFilmIdAsync(filmId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateStockMovementDto dto)
        {
            var result = await _stockMovementService.CreateAsync(dto);
            return Ok(result);
        }
    }
} 