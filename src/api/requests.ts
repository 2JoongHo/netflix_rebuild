const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

if (!API_KEY) {
  // 개발 중 키를 빠뜨리면 바로 알 수 있게 에러를 던짐
  throw new Error("REACT_APP_TMDB_API_KEY가 .env에 없습니다.");
}

const requests = {
  movie: {
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213&language=ko-KR`,
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=ko-KR`, // 최신 영화
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=ko-KR`, // 인기 영화
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28&language=ko-KR`, // 액션 영화
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27&language=ko-KR`, // 공포 영화
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749&language=ko-KR`, // 로맨스 영화
    fetchAnimationMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16&language=ko-KR`, // 만화 영화
    fetchSFMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878&language=ko-KR`, // SF 영화
    fetchFantasyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=14&language=ko-KR`, // 판타지 영화
    fetchThrillerMovies: `/discover/movie?api_key=${API_KEY}&with_genres=53&language=ko-KR`, // 스릴러 영화
    fetchMysteryMovies: `/discover/movie?api_key=${API_KEY}&with_genres=9648&language=ko-KR`, // 미스테리 영화
    fetchFamilyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10751&language=ko-KR`, // 가족 영화
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35&language=ko-KR`, // 코미디 영화
  },
  tv: {
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213&language=ko-KR`,
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=ko-KR`, // 최신 영화
    fetchTopRated: `/tv/top_rated?api_key=${API_KEY}&language=ko-KR`, // 인기 영화
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28&language=ko-KR`, // 액션 영화
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27&language=ko-KR`, // 공포 영화
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749&language=ko-KR`, // 로맨스 영화
    fetchAnimationMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16&language=ko-KR`, // 만화 영화
    fetchSFMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878&language=ko-KR`, // SF 영화
    fetchFantasyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=14&language=ko-KR`, // 판타지 영화
    fetchThrillerMovies: `/discover/movie?api_key=${API_KEY}&with_genres=53&language=ko-KR`, // 스릴러 영화
    fetchMysteryMovies: `/discover/movie?api_key=${API_KEY}&with_genres=9648&language=ko-KR`, // 미스테리 영화
    fetchFamilyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10751&language=ko-KR`, // 가족 영화
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35&language=ko-KR`, // 코미디 영화
  },
};

export default requests;
