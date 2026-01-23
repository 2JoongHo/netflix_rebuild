import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import type { Movie } from "../types/movie";
import styles from "./Row.module.css";

interface RowProps {
  title: string; // Row 제목
  fetchUrl: string; // TMDB 요청 주소
  onSelectMovie: (movie: Movie) => void;
}

export default function Row({ title, fetchUrl, onSelectMovie }: RowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        const response = await tmdb.get<{results: Movie[] }> (fetchUrl);
        if (isMounted) setMovies(response.data.results ?? []);
      } catch (e) {
        if (isMounted) setMovies([]);
      }
    };
    fetchMovies();

    return () => {
      isMounted = false;
    }
  }, [fetchUrl]);

  return (
    <section className={styles.row}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.posters}>
        {movies
          .filter((m) => m.poster_path)
          .map((m) => (
            <img
              key={m.id}
              className={styles.poster}
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              alt={m.title ?? m.name ?? "poster"}
              onClick={() => onSelectMovie(m)}
            />
          ))}
      </div>
    </section>
  );
}
