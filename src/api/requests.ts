const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

if (!API_KEY) {
  // 개발 중 키를 빠뜨리면 바로 알 수 있게 에러를 던짐
  throw new Error("REACT_APP_TMDB_API_KEY가 .env에 없습니다.");
}

const requests = {
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213$language=ko-KR`,
};

export default requests;
