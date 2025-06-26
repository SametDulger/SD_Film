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
        public async Task<IActionResult> GetAll()
        {
            var result = await _filmService.GetAllAsync();
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
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var result = await _filmService.GetByCategoryAsync(categoryId);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            var result = await _filmService.SearchAsync(q);
            return Ok(result);
        }

        [HttpGet("new-releases")]
        public async Task<IActionResult> GetNewReleases()
        {
            var result = await _filmService.GetNewReleasesAsync();
            return Ok(result);
        }

        [HttpGet("editor-choices")]
        public async Task<IActionResult> GetEditorChoices()
        {
            var result = await _filmService.GetEditorChoicesAsync();
            return Ok(result);
        }

        [HttpGet("most-rented")]
        public async Task<IActionResult> GetMostRented()
        {
            var result = await _filmService.GetMostRentedAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFilmDto createFilmDto)
        {
            var result = await _filmService.CreateAsync(createFilmDto);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateFilmDto updateFilmDto)
        {
            var result = await _filmService.UpdateAsync(id, updateFilmDto);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _filmService.DeleteAsync(id);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}/stock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockDto updateStockDto)
        {
            var result = await _filmService.UpdateStockAsync(id, updateStockDto.NewStockCount);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("add-stock")]
        public async Task<IActionResult> AddStock([FromBody] AddStockDto addStockDto)
        {
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
        public async Task<IActionResult> RemoveStock([FromBody] RemoveStockDto removeStockDto)
        {
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