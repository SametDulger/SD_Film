using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class CartService : ICartService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;
        private readonly IOrderService _orderService;

        public CartService(SDFilmDbContext context, IMapper mapper, IOrderService orderService)
        {
            _context = context;
            _mapper = mapper;
            _orderService = orderService;
        }

        public async Task<ApiResponse<CartSummaryDto>> GetUserCartAsync(int userId)
        {
            try
            {
                var cartItems = await _context.Carts
                    .Include(c => c.Film)
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.AddedDate)
                    .ToListAsync();

                var cartDtos = cartItems.Select(item => new CartDto
                {
                    Id = item.Id,
                    UserId = item.UserId,
                    FilmId = item.FilmId,
                    FilmTitle = item.Film.Title,
                    FilmDirector = item.Film.Director,
                    FilmPrice = item.Film.Price,
                    Quantity = item.Quantity,
                    TotalPrice = item.Film.Price * item.Quantity,
                    AddedDate = item.AddedDate
                }).ToList();

                var summary = new CartSummaryDto
                {
                    TotalItems = cartDtos.Sum(item => item.Quantity),
                    TotalAmount = cartDtos.Sum(item => item.TotalPrice),
                    Items = cartDtos
                };

                return ApiResponse<CartSummaryDto>.SuccessResult(summary);
            }
            catch (Exception ex)
            {
                return ApiResponse<CartSummaryDto>.ErrorResult($"Sepet getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CartDto>> AddToCartAsync(int userId, CreateCartDto createCartDto)
        {
            try
            {
                var film = await _context.Films.FindAsync(createCartDto.FilmId);
                if (film == null)
                    return ApiResponse<CartDto>.ErrorResult("Film bulunamadı");

                if (!film.IsAvailable || film.StockCount < createCartDto.Quantity)
                    return ApiResponse<CartDto>.ErrorResult("Film stokta yok veya yetersiz stok");

                var existingItem = await _context.Carts
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.FilmId == createCartDto.FilmId);

                if (existingItem != null)
                {
                    existingItem.Quantity += createCartDto.Quantity;
                    existingItem.UpdatedDate = DateTime.Now;
                }
                else
                {
                    var cartItem = new Cart
                    {
                        UserId = userId,
                        FilmId = createCartDto.FilmId,
                        Quantity = createCartDto.Quantity,
                        AddedDate = DateTime.Now
                    };
                    _context.Carts.Add(cartItem);
                }

                await _context.SaveChangesAsync();

                var cartDto = new CartDto
                {
                    Id = existingItem?.Id ?? 0,
                    UserId = userId,
                    FilmId = createCartDto.FilmId,
                    FilmTitle = film.Title,
                    FilmDirector = film.Director,
                    FilmPrice = film.Price,
                    Quantity = existingItem?.Quantity ?? createCartDto.Quantity,
                    TotalPrice = film.Price * (existingItem?.Quantity ?? createCartDto.Quantity),
                    AddedDate = existingItem?.AddedDate ?? DateTime.Now
                };

                return ApiResponse<CartDto>.SuccessResult(cartDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<CartDto>.ErrorResult($"Sepete eklenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CartDto>> UpdateCartItemAsync(int cartItemId, UpdateCartDto updateCartDto)
        {
            try
            {
                var cartItem = await _context.Carts
                    .Include(c => c.Film)
                    .FirstOrDefaultAsync(c => c.Id == cartItemId);

                if (cartItem == null)
                    return ApiResponse<CartDto>.ErrorResult("Sepet öğesi bulunamadı");

                if (updateCartDto.Quantity <= 0)
                {
                    _context.Carts.Remove(cartItem);
                    await _context.SaveChangesAsync();
                    return ApiResponse<CartDto>.SuccessResult(null);
                }

                if (cartItem.Film.StockCount < updateCartDto.Quantity)
                    return ApiResponse<CartDto>.ErrorResult("Yetersiz stok");

                cartItem.Quantity = updateCartDto.Quantity;
                cartItem.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var cartDto = new CartDto
                {
                    Id = cartItem.Id,
                    UserId = cartItem.UserId,
                    FilmId = cartItem.FilmId,
                    FilmTitle = cartItem.Film.Title,
                    FilmDirector = cartItem.Film.Director,
                    FilmPrice = cartItem.Film.Price,
                    Quantity = cartItem.Quantity,
                    TotalPrice = cartItem.Film.Price * cartItem.Quantity,
                    AddedDate = cartItem.AddedDate
                };

                return ApiResponse<CartDto>.SuccessResult(cartDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<CartDto>.ErrorResult($"Sepet güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> RemoveFromCartAsync(int cartItemId)
        {
            try
            {
                var cartItem = await _context.Carts.FindAsync(cartItemId);
                if (cartItem == null)
                    return ApiResponse<bool>.ErrorResult("Sepet öğesi bulunamadı");

                _context.Carts.Remove(cartItem);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Sepetten kaldırılırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> ClearCartAsync(int userId)
        {
            try
            {
                var cartItems = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
                _context.Carts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Sepet temizlenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> CheckoutAsync(int userId, string deliveryAddress)
        {
            try
            {
                var cartItems = await _context.Carts
                    .Include(c => c.Film)
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                if (!cartItems.Any())
                    return ApiResponse<bool>.ErrorResult("Sepet boş");

                // Stok kontrolü
                foreach (var item in cartItems)
                {
                    if (item.Film.StockCount < item.Quantity)
                        return ApiResponse<bool>.ErrorResult($"{item.Film.Title} için yetersiz stok");
                }

                // Sipariş oluştur
                var orderDto = new CreateOrderDto
                {
                    UserId = userId,
                    DeliveryAddress = deliveryAddress,
                    Notes = "Sepetten oluşturulan sipariş"
                };

                var orderResult = await _orderService.CreateAsync(orderDto);
                if (!orderResult.Success)
                    return ApiResponse<bool>.ErrorResult(orderResult.Message);

                // Sepeti temizle
                _context.Carts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Sipariş oluşturulurken hata oluştu: {ex.Message}");
            }
        }
    }
} 