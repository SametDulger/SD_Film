using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class CreateStockMovementDtoValidator : AbstractValidator<CreateStockMovementDto>
    {
        public CreateStockMovementDtoValidator()
        {
            RuleFor(x => x.FilmId)
                .GreaterThan(0).WithMessage("Film ID'si 0'dan büyük olmalıdır");

            RuleFor(x => x.MovementType)
                .NotEmpty().WithMessage("Hareket tipi zorunludur")
                .Must(x => x == "In" || x == "Out").WithMessage("Hareket tipi 'In' veya 'Out' olmalıdır");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır");

            RuleFor(x => x.Notes)
                .MaximumLength(1000).WithMessage("Notlar en fazla 1000 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Notes));
        }
    }
} 