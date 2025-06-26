using Microsoft.EntityFrameworkCore;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;
using SDFilm.DataAccess;

namespace SDFilm.Business.Services
{
    public class FinancialReportService : IFinancialReportService
    {
        private readonly SDFilmDbContext _context;

        public FinancialReportService(SDFilmDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<FinancialReportDto>> GetFinancialReportAsync()
        {
            try
            {
                var completedOrders = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Film)
                    .ThenInclude(f => f.Category)
                    .Where(o => o.Status == "Delivered")
                    .ToListAsync();

                var totalRevenue = completedOrders.Sum(o => o.TotalAmount);
                var totalOrders = completedOrders.Count;
                var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                var monthlyRevenue = await GetMonthlyRevenueAsync(DateTime.Now.Year);
                var categoryRevenue = await GetCategoryRevenueAsync();
                var expenses = GetExpenses();
                var totalExpenses = expenses.Sum(e => e.Amount);
                var netProfit = totalRevenue - totalExpenses;
                var profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

                var report = new FinancialReportDto
                {
                    TotalRevenue = totalRevenue,
                    TotalOrders = totalOrders,
                    AverageOrderValue = averageOrderValue,
                    MonthlyRevenue = monthlyRevenue.Data ?? new List<MonthlyRevenueDto>(),
                    CategoryRevenue = categoryRevenue.Data ?? new List<CategoryRevenueDto>(),
                    Expenses = expenses,
                    TotalExpenses = totalExpenses,
                    NetProfit = netProfit,
                    ProfitMargin = profitMargin
                };

                return ApiResponse<FinancialReportDto>.SuccessResult(report);
            }
            catch (Exception ex)
            {
                return ApiResponse<FinancialReportDto>.ErrorResult($"Finansal rapor oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<MonthlyRevenueDto>>> GetMonthlyRevenueAsync(int year)
        {
            try
            {
                var monthlyData = await _context.Orders
                    .Where(o => o.Status == "Delivered" && o.OrderDate.Year == year)
                    .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                    .Select(g => new
                    {
                        Month = g.Key.Month,
                        Revenue = g.Sum(o => o.TotalAmount),
                        OrderCount = g.Count()
                    })
                    .OrderBy(x => x.Month)
                    .ToListAsync();

                var result = monthlyData.Select(x => new MonthlyRevenueDto
                {
                    Month = GetMonthName(x.Month),
                    Revenue = x.Revenue,
                    OrderCount = x.OrderCount
                }).ToList();

                return ApiResponse<List<MonthlyRevenueDto>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<MonthlyRevenueDto>>.ErrorResult($"Aylık gelir raporu oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<CategoryRevenueDto>>> GetCategoryRevenueAsync()
        {
            try
            {
                var categoryData = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Film)
                    .ThenInclude(f => f.Category)
                    .Where(o => o.Status == "Delivered")
                    .SelectMany(o => o.OrderDetails)
                    .GroupBy(od => od.Film.Category.Name)
                    .Select(g => new
                    {
                        Category = g.Key,
                        Revenue = g.Sum(od => od.TotalPrice),
                        OrderCount = g.Count()
                    })
                    .OrderByDescending(x => x.Revenue)
                    .ToListAsync();

                var result = categoryData.Select(x => new CategoryRevenueDto
                {
                    Category = x.Category,
                    Revenue = x.Revenue,
                    OrderCount = x.OrderCount
                }).ToList();

                return ApiResponse<List<CategoryRevenueDto>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<CategoryRevenueDto>>.ErrorResult($"Kategori gelir raporu oluşturulurken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<decimal>> GetTotalRevenueAsync()
        {
            try
            {
                var totalRevenue = await _context.Orders
                    .Where(o => o.Status == "Delivered")
                    .SumAsync(o => o.TotalAmount);

                return ApiResponse<decimal>.SuccessResult(totalRevenue);
            }
            catch (Exception ex)
            {
                return ApiResponse<decimal>.ErrorResult($"Toplam gelir hesaplanırken hata oluştu: {ex.Message}");
            }
        }

        public async Task<ApiResponse<decimal>> GetNetProfitAsync()
        {
            try
            {
                var totalRevenue = await _context.Orders
                    .Where(o => o.Status == "Delivered")
                    .SumAsync(o => o.TotalAmount);

                var expenses = GetExpenses();
                var totalExpenses = expenses.Sum(e => e.Amount);
                var netProfit = totalRevenue - totalExpenses;

                return ApiResponse<decimal>.SuccessResult(netProfit);
            }
            catch (Exception ex)
            {
                return ApiResponse<decimal>.ErrorResult($"Net kar hesaplanırken hata oluştu: {ex.Message}");
            }
        }

        private List<ExpenseDto> GetExpenses()
        {
            return new List<ExpenseDto>
            {
                new ExpenseDto { Name = "Personel Maaşları", Amount = 15000, Type = "Operasyonel" },
                new ExpenseDto { Name = "Kurye Maliyetleri", Amount = 3500, Type = "Operasyonel" },
                new ExpenseDto { Name = "Depo Kiraları", Amount = 2000, Type = "Operasyonel" },
                new ExpenseDto { Name = "Yazılım Lisansları", Amount = 500, Type = "Teknoloji" },
                new ExpenseDto { Name = "Film Satın Alma", Amount = 8000, Type = "Envanter" },
                new ExpenseDto { Name = "Pazarlama", Amount = 3000, Type = "Pazarlama" }
            };
        }

        private string GetMonthName(int month)
        {
            return month switch
            {
                1 => "Ocak",
                2 => "Şubat",
                3 => "Mart",
                4 => "Nisan",
                5 => "Mayıs",
                6 => "Haziran",
                7 => "Temmuz",
                8 => "Ağustos",
                9 => "Eylül",
                10 => "Ekim",
                11 => "Kasım",
                12 => "Aralık",
                _ => "Bilinmeyen"
            };
        }
    }
} 