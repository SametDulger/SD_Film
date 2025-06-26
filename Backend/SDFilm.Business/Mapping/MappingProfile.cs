using AutoMapper;
using SDFilm.Core.DTOs;
using SDFilm.Entities;

namespace SDFilm.Business.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>();
            CreateMap<UpdateUserDto, User>();

            CreateMap<Film, FilmDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.Actors, opt => opt.MapFrom(src => src.Cast));

            CreateMap<CreateFilmDto, Film>()
                .ForMember(dest => dest.Cast, opt => opt.MapFrom(src => src.Actors));
            CreateMap<UpdateFilmDto, Film>()
                .ForMember(dest => dest.Cast, opt => opt.MapFrom(src => src.Actors));

            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.CourierName, opt => opt.MapFrom(src => src.Courier != null ? $"{src.Courier.FirstName} {src.Courier.LastName}" : null));

            CreateMap<CreateOrderDto, Order>();
            CreateMap<UpdateOrderDto, Order>();

            CreateMap<OrderDetail, OrderDetailDto>()
                .ForMember(dest => dest.FilmTitle, opt => opt.MapFrom(src => src.Film != null ? src.Film.Title : null));

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.FilmCount, opt => opt.MapFrom(src => src.Films != null ? src.Films.Count : 0));
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            CreateMap<Package, PackageDto>();
            CreateMap<CreatePackageDto, Package>();
            CreateMap<UpdatePackageDto, Package>();

            CreateMap<StockMovement, StockMovementDto>()
                .ForMember(dest => dest.FilmTitle, opt => opt.MapFrom(src => src.Film != null ? src.Film.Title : null));
            CreateMap<CreateStockMovementDto, StockMovement>();

            CreateMap<UserPackage, UserPackageDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : null))
                .ForMember(dest => dest.PackageName, opt => opt.MapFrom(src => src.Package != null ? src.Package.Name : null));
            CreateMap<CreateUserPackageDto, UserPackage>();
            CreateMap<UpdateUserPackageDto, UserPackage>();

            CreateMap<UserFilmList, UserFilmListDto>()
                .ForMember(dest => dest.FilmTitle, opt => opt.MapFrom(src => src.Film != null ? src.Film.Title : null));
            CreateMap<CreateUserFilmListDto, UserFilmList>();
            CreateMap<UpdateUserFilmListDto, UserFilmList>();

            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.FilmTitle, opt => opt.MapFrom(src => src.Film != null ? src.Film.Title : null))
                .ForMember(dest => dest.FilmDirector, opt => opt.MapFrom(src => src.Film != null ? src.Film.Director : null))
                .ForMember(dest => dest.FilmPrice, opt => opt.MapFrom(src => src.Film != null ? src.Film.Price : 0))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Film != null ? src.Film.Price * src.Quantity : 0));
            CreateMap<CreateCartDto, Cart>();
            CreateMap<UpdateCartDto, Cart>();
        }
    }
} 