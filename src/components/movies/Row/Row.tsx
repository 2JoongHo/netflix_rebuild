import { useEffect, useState } from "react";
import styles from "./Row.module.css";
import tmdb from "../../../api/tmdb";
import type { Movie } from "../../../types/movie";

interface RowProps {
  title: string; // Row 제목
  fetchUrl: string; // TMDB 요청 주소
}

export default function Row({ title, fetchUrl }: RowProps) {
  console.log("Row 렌더링:", title);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      console.log("fetchUrl:", fetchUrl);
      const response = await tmdb.get<{ results: Movie[] }>(fetchUrl);
      console.log("results length:", response.data.results?.length);
      setMovies(response.data.results ?? []);
    };
    fetchMovies();
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
            />
          ))}
      </div>
    </section>
  );
}
