using SDFilm.Core.DTOs;

namespace SDFilm.Business.Interfaces
{
    public interface IFinancialReportService
    {
        Task<ApiResponse<FinancialReportDto>> GetFinancialReportAsync();
        Task<ApiResponse<List<MonthlyRevenueDto>>> GetMonthlyRevenueAsync(int year);
        Task<ApiResponse<List<CategoryRevenueDto>>> GetCategoryRevenueAsync();
        Task<ApiResponse<decimal>> GetTotalRevenueAsync();
        Task<ApiResponse<decimal>> GetNetProfitAsync();
    }
} 