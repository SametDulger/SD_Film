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
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = GetCurrentUserId();
            var result = await _cartService.GetUserCartAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CreateCartDto createCartDto)
        {
            var userId = GetCurrentUserId();
            var result = await _cartService.AddToCartAsync(userId, createCartDto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] UpdateCartDto updateCartDto)
        {
            var result = await _cartService.UpdateCartItemAsync(id, updateCartDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var result = await _cartService.RemoveFromCartAsync(id);
            return Ok(result);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            var result = await _cartService.ClearCartAsync(userId);
            return Ok(result);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutDto checkoutDto)
        {
            var userId = GetCurrentUserId();
            var result = await _cartService.CheckoutAsync(userId, checkoutDto.DeliveryAddress);
            return Ok(result);
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestAuth()
        {
            var userId = GetCurrentUserId();
            return Ok(new { userId = userId, message = "Authentication working" });
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı");
            
            return userId;
        }
    }

    public class CheckoutDto
    {
        public string DeliveryAddress { get; set; } = string.Empty;
    }
} 