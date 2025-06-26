using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SDFilm.Business.Interfaces;
using SDFilm.Core.DTOs;

namespace SDFilm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AccountantPolicy")]
    public class FinancialReportsController : ControllerBase
    {
        private readonly IFinancialReportService _financialReportService;

        public FinancialReportsController(IFinancialReportService financialReportService)
        {
            _financialReportService = financialReportService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFinancialReport()
        {
            var result = await _financialReportService.GetFinancialReportAsync();
            return Ok(result);
        }

        [HttpGet("monthly-revenue/{year}")]
        public async Task<IActionResult> GetMonthlyRevenue(int year)
        {
            var result = await _financialReportService.GetMonthlyRevenueAsync(year);
            return Ok(result);
        }

        [HttpGet("category-revenue")]
        public async Task<IActionResult> GetCategoryRevenue()
        {
            var result = await _financialReportService.GetCategoryRevenueAsync();
            return Ok(result);
        }

        [HttpGet("total-revenue")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            var result = await _financialReportService.GetTotalRevenueAsync();
            return Ok(result);
        }

        [HttpGet("net-profit")]
        public async Task<IActionResult> GetNetProfit()
        {
            var result = await _financialReportService.GetNetProfitAsync();
            return Ok(result);
        }
    }
} 