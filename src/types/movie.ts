export interface Movie {
  id: number;
  title?: string; // 영화 제목
  name?: string; // TV 제목
  overview?: string; // 줄거리
  backdrop_path?: string; // 배너 이미지 경로
  poster_path?: string; // 포스터 이미지 파일 경로
  media_type?: "movie" | "tv";
}
