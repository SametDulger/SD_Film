using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class CreateFilmDtoValidator : AbstractValidator<CreateFilmDto>
    {
        public CreateFilmDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Film başlığı zorunludur")
                .MaximumLength(200).WithMessage("Film başlığı en fazla 200 karakter olabilir");

            RuleFor(x => x.Director)
                .NotEmpty().WithMessage("Yönetmen adı zorunludur")
                .MaximumLength(100).WithMessage("Yönetmen adı en fazla 100 karakter olabilir");

            RuleFor(x => x.Actors)
                .MaximumLength(500).WithMessage("Oyuncular en fazla 500 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Actors));

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1900, DateTime.Now.Year + 1)
                .WithMessage($"Yayın yılı 1900 ile {DateTime.Now.Year + 1} arasında olmalıdır");

            RuleFor(x => x.Duration)
                .GreaterThan(0).WithMessage("Süre 0'dan büyük olmalıdır")
                .LessThanOrEqualTo(600).WithMessage("Süre 600 dakikadan az olmalıdır");

            RuleFor(x => x.Language)
                .NotEmpty().WithMessage("Dil zorunludur")
                .MaximumLength(50).WithMessage("Dil en fazla 50 karakter olabilir");

            RuleFor(x => x.Subtitle)
                .MaximumLength(50).WithMessage("Altyazı en fazla 50 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Subtitle));

            RuleFor(x => x.Audio)
                .MaximumLength(100).WithMessage("Ses en fazla 100 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Audio));

            RuleFor(x => x.Barcode)
                .MaximumLength(50).WithMessage("Barkod en fazla 50 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Barcode));

            RuleFor(x => x.ImageUrl)
                .MaximumLength(500).WithMessage("Resim URL'si en fazla 500 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.ImageUrl));

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Kategori ID'si 0'dan büyük olmalıdır");

            RuleFor(x => x.StockCount)
                .GreaterThanOrEqualTo(0).WithMessage("Stok miktarı negatif olamaz");

            RuleFor(x => x.ShelfLocation)
                .MaximumLength(20).WithMessage("Raf konumu en fazla 20 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.ShelfLocation));

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Fiyat negatif olamaz");
        }
    }
} 