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
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [Authorize(Policy = "CoordinatorPolicy")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _orderService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _orderService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.GetUserOrdersAsync(userId);
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var response = await _orderService.GetUserOrdersAsync(userId);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateOrderDto createOrderDto)
        {
            var userId = GetCurrentUserId();
            createOrderDto.UserId = userId;
            
            var result = await _orderService.CreateAsync(createOrderDto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Update(int id, UpdateOrderDto updateOrderDto)
        {
            var result = await _orderService.UpdateAsync(id, updateOrderDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _orderService.DeleteAsync(id);
            return Ok(result);
        }

        [HttpPost("{orderId}/assign-courier/{courierId}")]
        [Authorize(Policy = "CoordinatorPolicy")]
        public async Task<IActionResult> AssignCourier(int orderId, int courierId)
        {
            var result = await _orderService.AssignCourierAsync(orderId, courierId);
            return Ok(result);
        }

        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            var response = await _orderService.UpdateStatusAsync(orderId, status);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
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