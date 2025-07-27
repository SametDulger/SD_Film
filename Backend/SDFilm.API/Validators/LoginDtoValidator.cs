using FluentValidation;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email alanı zorunludur")
                .EmailAddress().WithMessage("Geçerli bir email adresi giriniz");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Şifre alanı zorunludur");
        }
    }
} 