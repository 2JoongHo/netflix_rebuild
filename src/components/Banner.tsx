// 배너 페이지 컴포넌트

import { useEffect, useMemo, useState } from "react";
import tmdb from "../api/tmdb";
import type { Movie } from "../types/movie";
import styles from "./Banner.module.css";

interface BannerItem {
  title: string;
  overview: string;
  backdropUrl: string;
}

interface BannerProps {
  fetchUrl: string;
  onSelectMovie?: (movie: Movie) => void;
}

// 글이 너무 길 경우 ...으로 자르기
function truncate(text: string, max = 120) {
  return text.length > max ? text.slice(0, max - 1) + "..." : text;
}

export default function Banner({ fetchUrl, onSelectMovie }: BannerProps) {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchBannerMovie = async () => {
      const response = await tmdb.get<{ results: Movie[] }>(
        fetchUrl
        // requests.movie.fetchNetflixOriginals,
      );

      const results = response.data.results;

      //   결과가 비어있을 경우 종료
      if (!results || results.length === 0) return;

      const random = results[Math.floor(Math.random() * results.length)];
      setMovie(random);
    };
    fetchBannerMovie();
  }, [fetchUrl]);

  const item: BannerItem | null = useMemo(() => {
    if (!movie) return null;

    const title = movie.title ?? movie.name ?? "Untitled";

    const overview = movie.overview ?? "";

    if (!movie.backdrop_path) return null;

    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    return {
      title,
      overview: truncate(overview, 140),
      backdropUrl,
    };
  }, [movie]);

  // 상세정보 클릭 핸들러
  const handleOpenDetail = () => {
    if(!movie) return;
    onSelectMovie?.(movie);
  }

  if (!item) {
    return (
      <header className={styles.banner} style={{ backgroundImage: "none" }}>
        <div className={styles.content}>
          <h2 className={styles.title}>Loading...</h2>
          <p className={styles.desc}>배너 데이터를 불러오는 중</p>
        </div>
        <div className={styles.fadeBottom} />
      </header>
    );
  }

  return (
    <header
      className={styles.banner}
      style={{ backgroundImage: `url(${item.backdropUrl})` }}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{item.title}</h2>
        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.play}`}>▶ 재생</button>
          <button 
            className={`${styles.button} ${styles.info}`}
            onClick={handleOpenDetail}
          >
            ⓘ 상세 정보
          </button>
        </div>
        <p className={styles.desc}>{item.overview}</p>
      </div>
      <div className={styles.fadeBottom} />
    </header>
  );
}
