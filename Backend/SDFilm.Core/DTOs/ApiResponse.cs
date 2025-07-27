namespace SDFilm.Core.DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T Data { get; set; } = default!;
        public List<string> Errors { get; set; } = new List<string>();
        public PaginationInfo? Pagination { get; set; }

        public static ApiResponse<T> SuccessResult(T data, string message = "İşlem başarılı")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> SuccessResult(T data, PaginationInfo pagination, string message = "İşlem başarılı")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Pagination = pagination
            };
        }

        public static ApiResponse<T> ErrorResult(string message, List<string> errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }

        public static ApiResponse<T> ErrorResult(string message, string error)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error }
            };
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse SuccessResult(string message = "İşlem başarılı")
        {
            return new ApiResponse
            {
                Success = true,
                Message = message
            };
        }

        public new static ApiResponse ErrorResult(string message, List<string> errors = null)
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }

        public new static ApiResponse ErrorResult(string message, string error)
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error }
            };
        }
    }

    public class PaginationInfo
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }

        public PaginationInfo(int page, int pageSize, int totalCount)
        {
            Page = page;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            HasPreviousPage = page > 1;
            HasNextPage = page < TotalPages;
        }
    }
} 