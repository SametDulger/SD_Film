using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderDtoValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("Kullanıcı ID'si 0'dan büyük olmalıdır");

            RuleFor(x => x.DeliveryAddress)
                .NotEmpty().WithMessage("Teslimat adresi zorunludur")
                .MaximumLength(500).WithMessage("Teslimat adresi en fazla 500 karakter olabilir");

            RuleFor(x => x.Notes)
                .MaximumLength(1000).WithMessage("Notlar en fazla 1000 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Notes));

            RuleFor(x => x.OrderDetails)
                .NotEmpty().WithMessage("Sipariş detayları zorunludur")
                .Must(x => x.Count > 0).WithMessage("En az bir film seçilmelidir");

            RuleForEach(x => x.OrderDetails).SetValidator(new CreateOrderDetailDtoValidator());
        }
    }

    public class CreateOrderDetailDtoValidator : AbstractValidator<CreateOrderDetailDto>
    {
        public CreateOrderDetailDtoValidator()
        {
            RuleFor(x => x.FilmId)
                .GreaterThan(0).WithMessage("Film ID'si 0'dan büyük olmalıdır");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır")
                .LessThanOrEqualTo(10).WithMessage("Bir seferde en fazla 10 film kiralanabilir");
        }
    }
} 