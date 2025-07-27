using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SDFilm.Business.Interfaces;
using SDFilm.Business.Services;
using SDFilm.Business.Mapping;
using SDFilm.DataAccess;
using System.Text;
using Serilog;
using FluentValidation;
using SDFilm.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Sade Serilog yapılandırması
builder.Host.UseSerilog((ctx, lc) => lc.WriteTo.Console());

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "SD Film API", 
        Version = "v1",
        Description = "SD Film kiralama sistemi API'si",
        Contact = new OpenApiContact
        {
            Name = "SD Film Team",
            Email = "info@sdfilm.com"
        }
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Database configuration
builder.Services.AddDbContext<SDFilmDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// AutoMapper configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Service registrations
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFilmService, FilmService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserFilmListService, UserFilmListService>();
builder.Services.AddScoped<IStockMovementService, StockMovementService>();
builder.Services.AddScoped<IFinancialReportService, FinancialReportService>();
builder.Services.AddScoped<IUserPackageService, UserPackageService>();
builder.Services.AddScoped<ICartService, CartService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];
if (string.IsNullOrEmpty(secretKey))
{
    // In production, this should be set via environment variable
    secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? 
                "SuperSecretKeyForJwtToken123!@#$%^&*()_+QWERTYUIOP";
}

var key = Encoding.UTF8.GetBytes(secretKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("CoordinatorPolicy", policy => policy.RequireRole("Admin", "Coordinator"));
    options.AddPolicy("AccountantPolicy", policy => policy.RequireRole("Admin", "Accountant"));
    options.AddPolicy("WarehousePolicy", policy => policy.RequireRole("Admin", "Warehouse"));
    options.AddPolicy("CourierPolicy", policy => policy.RequireRole("Admin", "Courier"));
    options.AddPolicy("FilmEntryPolicy", policy => policy.RequireRole("Admin", "FilmEntry"));
    options.AddPolicy("CustomerPolicy", policy => policy.RequireRole("Admin", "Customer"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SD Film API V1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Global exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SDFilmDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
