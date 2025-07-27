using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Ad alanı zorunludur")
                .MaximumLength(50).WithMessage("Ad en fazla 50 karakter olabilir");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Soyad alanı zorunludur")
                .MaximumLength(50).WithMessage("Soyad en fazla 50 karakter olabilir");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email alanı zorunludur")
                .EmailAddress().WithMessage("Geçerli bir email adresi giriniz")
                .MaximumLength(100).WithMessage("Email en fazla 100 karakter olabilir");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Şifre alanı zorunludur")
                .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır")
                .MaximumLength(100).WithMessage("Şifre en fazla 100 karakter olabilir");

            RuleFor(x => x.Phone)
                .MaximumLength(20).WithMessage("Telefon numarası en fazla 20 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.Address)
                .MaximumLength(500).WithMessage("Adres en fazla 500 karakter olabilir")
                .When(x => !string.IsNullOrEmpty(x.Address));

            RuleFor(x => x.Role)
                .IsInEnum().WithMessage("Geçerli bir rol seçiniz");
        }
    }
} 