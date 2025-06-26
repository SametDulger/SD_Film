using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;
using SDFilm.Entities;

namespace SDFilm.Business.Services
{
    public class UserFilmListService : IUserFilmListService
    {
        private readonly SDFilmDbContext _context;
        private readonly IMapper _mapper;

        public UserFilmListService(SDFilmDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<UserFilmListDto>>> GetUserFilmListAsync(int userId)
        {
            try
            {
                var userFilmList = await _context.UserFilmLists
                    .Include(ufl => ufl.User)
                    .Include(ufl => ufl.Film)
                    .Where(ufl => ufl.UserId == userId)
                    .OrderByDescending(ufl => ufl.AddedDate)
                    .ToListAsync();

                var userFilmListDtos = _mapper.Map<List<UserFilmListDto>>(userFilmList);
                return ApiResponse<List<UserFilmListDto>>.SuccessResult(userFilmListDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserFilmListDto>>.ErrorResult($"Kullanıcı film listesi getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserFilmListDto>> AddToUserListAsync(CreateUserFilmListDto createUserFilmListDto)
        {
            try
            {
                var existingItem = await _context.UserFilmLists
                    .FirstOrDefaultAsync(ufl => ufl.UserId == createUserFilmListDto.UserId && 
                                               ufl.FilmId == createUserFilmListDto.FilmId);

                if (existingItem != null)
                    return ApiResponse<UserFilmListDto>.ErrorResult("Film zaten listenizde mevcut");

                var userFilmList = _mapper.Map<UserFilmList>(createUserFilmListDto);
                userFilmList.AddedDate = DateTime.Now;
                userFilmList.IsWatched = false;

                _context.UserFilmLists.Add(userFilmList);
                await _context.SaveChangesAsync();

                var userFilmListDto = await GetUserFilmListDtoWithDetails(userFilmList.Id);
                return ApiResponse<UserFilmListDto>.SuccessResult(userFilmListDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserFilmListDto>.ErrorResult($"Film listeye eklenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserFilmListDto>> UpdateUserFilmAsync(int id, UpdateUserFilmListDto updateUserFilmListDto)
        {
            try
            {
                var userFilmList = await _context.UserFilmLists.FindAsync(id);
                if (userFilmList == null)
                    return ApiResponse<UserFilmListDto>.ErrorResult("Film listesi öğesi bulunamadı");

                _mapper.Map(updateUserFilmListDto, userFilmList);
                userFilmList.UpdatedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                var userFilmListDto = await GetUserFilmListDtoWithDetails(userFilmList.Id);
                return ApiResponse<UserFilmListDto>.SuccessResult(userFilmListDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserFilmListDto>.ErrorResult($"Film listesi güncellenirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> RemoveFromUserListAsync(int id)
        {
            try
            {
                var userFilmList = await _context.UserFilmLists.FindAsync(id);
                if (userFilmList == null)
                    return ApiResponse<bool>.ErrorResult("Film listesi öğesi bulunamadı");

                _context.UserFilmLists.Remove(userFilmList);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Film listeden kaldırılırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserFilmListDto>>> GetWatchedFilmsAsync(int userId)
        {
            try
            {
                var watchedFilms = await _context.UserFilmLists
                    .Include(ufl => ufl.User)
                    .Include(ufl => ufl.Film)
                    .Where(ufl => ufl.UserId == userId && ufl.IsWatched)
                    .OrderByDescending(ufl => ufl.UpdatedDate)
                    .ToListAsync();

                var watchedFilmDtos = _mapper.Map<List<UserFilmListDto>>(watchedFilms);
                return ApiResponse<List<UserFilmListDto>>.SuccessResult(watchedFilmDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserFilmListDto>>.ErrorResult($"İzlenen filmler getirilirken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserFilmListDto>>> GetWishlistAsync(int userId)
        {
            try
            {
                var wishlist = await _context.UserFilmLists
                    .Include(ufl => ufl.User)
                    .Include(ufl => ufl.Film)
                    .Where(ufl => ufl.UserId == userId && !ufl.IsWatched)
                    .OrderByDescending(ufl => ufl.AddedDate)
                    .ToListAsync();

                var wishlistDtos = _mapper.Map<List<UserFilmListDto>>(wishlist);
                return ApiResponse<List<UserFilmListDto>>.SuccessResult(wishlistDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserFilmListDto>>.ErrorResult($"İstek listesi getirilirken hata oluştu: {ex.Message}");
            }
        }

        private async Task<UserFilmListDto> GetUserFilmListDtoWithDetails(int id)
        {
            var userFilmList = await _context.UserFilmLists
                .Include(ufl => ufl.User)
                .Include(ufl => ufl.Film)
                .FirstOrDefaultAsync(ufl => ufl.Id == id);

            return _mapper.Map<UserFilmListDto>(userFilmList);
        }
    }
} 