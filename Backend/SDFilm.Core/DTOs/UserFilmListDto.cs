namespace SDFilm.Core.DTOs
{
    public class UserFilmListDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int FilmId { get; set; }
        public string FilmTitle { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public bool IsWatched { get; set; }
        public int? Rating { get; set; }
        public string Review { get; set; } = string.Empty;
    }

    public class CreateUserFilmListDto
    {
        public int UserId { get; set; }
        public int FilmId { get; set; }
    }

    public class UpdateUserFilmListDto
    {
        public bool IsWatched { get; set; }
        public int? Rating { get; set; }
        public string Review { get; set; } = string.Empty;
    }
} 