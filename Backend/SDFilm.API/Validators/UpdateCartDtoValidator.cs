using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class UpdateCartDtoValidator : AbstractValidator<UpdateCartDto>
    {
        public UpdateCartDtoValidator()
        {
            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır")
                .LessThanOrEqualTo(10).WithMessage("Bir seferde en fazla 10 adet eklenebilir");
        }
    }
} 