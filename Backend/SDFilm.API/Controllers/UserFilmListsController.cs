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
    public class UserFilmListsController : ControllerBase
    {
        private readonly IUserFilmListService _userFilmListService;

        public UserFilmListsController(IUserFilmListService userFilmListService)
        {
            _userFilmListService = userFilmListService;
        }

        [HttpGet("my-list")]
        public async Task<IActionResult> GetMyList()
        {
            var userId = GetCurrentUserId();
            var result = await _userFilmListService.GetUserFilmListAsync(userId);
            return Ok(result);
        }

        [HttpGet("watched")]
        public async Task<IActionResult> GetWatchedFilms()
        {
            var userId = GetCurrentUserId();
            var result = await _userFilmListService.GetWatchedFilmsAsync(userId);
            return Ok(result);
        }

        [HttpGet("wishlist")]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetCurrentUserId();
            var result = await _userFilmListService.GetWishlistAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToMyList(CreateUserFilmListDto createUserFilmListDto)
        {
            var userId = GetCurrentUserId();
            createUserFilmListDto.UserId = userId;
            
            var result = await _userFilmListService.AddToUserListAsync(createUserFilmListDto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMyFilm(int id, UpdateUserFilmListDto updateUserFilmListDto)
        {
            var result = await _userFilmListService.UpdateUserFilmAsync(id, updateUserFilmListDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromMyList(int id)
        {
            var result = await _userFilmListService.RemoveFromUserListAsync(id);
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