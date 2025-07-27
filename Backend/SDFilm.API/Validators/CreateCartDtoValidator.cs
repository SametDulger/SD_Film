using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class CreateCartDtoValidator : AbstractValidator<CreateCartDto>
    {
        public CreateCartDtoValidator()
        {
            RuleFor(x => x.FilmId)
                .GreaterThan(0).WithMessage("Film ID'si 0'dan büyük olmalıdır");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır")
                .LessThanOrEqualTo(10).WithMessage("Bir seferde en fazla 10 adet eklenebilir");
        }
    }
} 