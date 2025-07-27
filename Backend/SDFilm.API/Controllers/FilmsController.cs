using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmsController : ControllerBase
    {
        private readonly IFilmService _filmService;
        private readonly IStockMovementService _stockMovementService;

        public FilmsController(IFilmService filmService, IStockMovementService stockMovementService)
        {
            _filmService = filmService;
            _stockMovementService = stockMovementService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _filmService.GetAllAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _filmService.GetByIdAsync(id);
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _filmService.GetByCategoryAsync(categoryId, page, pageSize);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(ApiResponse<List<FilmDto>>.ErrorResult("Arama terimi boş olamaz"));

            var result = await _filmService.SearchAsync(q, page, pageSize);
            return Ok(result);
        }

        [HttpGet("new-releases")]
        public async Task<IActionResult> GetNewReleases([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _filmService.GetNewReleasesAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("editor-choices")]
        public async Task<IActionResult> GetEditorChoices([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _filmService.GetEditorChoicesAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("most-rented")]
        public async Task<IActionResult> GetMostRented([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _filmService.GetMostRentedAsync(page, pageSize);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Policy = "FilmEntryPolicy")]
        public async Task<IActionResult> Create([FromBody] CreateFilmDto createFilmDto)
        {
            var result = await _filmService.CreateAsync(createFilmDto);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "FilmEntryPolicy")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateFilmDto updateFilmDto)
        {
            var result = await _filmService.UpdateAsync(id, updateFilmDto);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "FilmEntryPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _filmService.DeleteAsync(id);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}/stock")]
        [Authorize(Policy = "WarehousePolicy")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockDto updateStockDto)
        {
            if (updateStockDto.NewStockCount < 0)
                return BadRequest(ApiResponse<bool>.ErrorResult("Stok miktarı negatif olamaz"));

            var result = await _filmService.UpdateStockAsync(id, updateStockDto.NewStockCount);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("add-stock")]
        [Authorize(Policy = "WarehousePolicy")]
        public async Task<IActionResult> AddStock([FromBody] AddStockDto addStockDto)
        {
            if (addStockDto.Quantity <= 0)
                return BadRequest(ApiResponse<bool>.ErrorResult("Miktar pozitif olmalıdır"));

            var result = await _stockMovementService.CreateAsync(new CreateStockMovementDto
            {
                FilmId = addStockDto.FilmId,
                MovementType = "In",
                Quantity = addStockDto.Quantity,
                Notes = "Stok eklendi"
            });
            return Ok(result);
        }

        [HttpPost("remove-stock")]
        [Authorize(Policy = "WarehousePolicy")]
        public async Task<IActionResult> RemoveStock([FromBody] RemoveStockDto removeStockDto)
        {
            if (removeStockDto.Quantity <= 0)
                return BadRequest(ApiResponse<bool>.ErrorResult("Miktar pozitif olmalıdır"));

            var result = await _stockMovementService.CreateAsync(new CreateStockMovementDto
            {
                FilmId = removeStockDto.FilmId,
                MovementType = "Out",
                Quantity = removeStockDto.Quantity,
                Notes = "Stok çıkarıldı"
            });
            return Ok(result);
        }
    }

    public class UpdateStockDto
    {
        public int NewStockCount { get; set; }
    }

    public class AddStockDto
    {
        public int FilmId { get; set; }
        public int Quantity { get; set; }
    }

    public class RemoveStockDto
    {
        public int FilmId { get; set; }
        public int Quantity { get; set; }
    }
} 