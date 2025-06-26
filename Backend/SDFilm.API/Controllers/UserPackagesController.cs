using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using System.Security.Claims;

namespace SDFilm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserPackagesController : ControllerBase
    {
        private readonly IUserPackageService _userPackageService;

        public UserPackagesController(IUserPackageService userPackageService)
        {
            _userPackageService = userPackageService;
        }

        [HttpGet]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _userPackageService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _userPackageService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("my-packages")]
        public async Task<IActionResult> GetMyPackages()
        {
            var userId = GetCurrentUserId();
            var result = await _userPackageService.GetByUserIdAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserPackageDto dto)
        {
            var result = await _userPackageService.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Update(int id, UpdateUserPackageDto dto)
        {
            var result = await _userPackageService.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userPackageService.DeleteAsync(id);
            return Ok(result);
        }

        [HttpPost("purchase/{packageId}")]
        public async Task<IActionResult> PurchasePackage(int packageId)
        {
            var userId = GetCurrentUserId();
            var result = await _userPackageService.PurchasePackageAsync(userId, packageId);
            return Ok(result);
        }

        [HttpPost("use-film")]
        public async Task<IActionResult> UseFilmFromPackage()
        {
            var userId = GetCurrentUserId();
            var result = await _userPackageService.UseFilmFromPackageAsync(userId);
            return Ok(result);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı");
            
            return userId;
        }
    }
} 