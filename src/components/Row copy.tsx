import { useEffect, useMemo, useRef, useState } from "react";
import tmdb from "../api/tmdb";
import type { Movie } from "../types/movie";
import styles from "./Row.module.css";

interface RowProps {
  title: string;
  fetchUrl: string;
  onSelectMovie: (movie: Movie) => void;
}

export default function Row({ title, fetchUrl, onSelectMovie }: RowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        const response = await tmdb.get<{ results: Movie[] }>(fetchUrl);
        if (isMounted) setMovies(response.data.results ?? []);
      } catch {
        if (isMounted) setMovies([]);
      }
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, [fetchUrl]);

  const posters = useMemo(() => movies.filter((m) => m.poster_path), [movies]);

  // 페이지 수 재계산 (maxScrollLeft 기준 = 마지막 페이지 계산이 더 정확)
  const recalcPages = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const pageWidth = el.clientWidth;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    const pages =
      maxScrollLeft <= 0 ? 1 : Math.ceil(maxScrollLeft / pageWidth) + 1;

    setTotalPages(pages);

    // 페이지 수가 줄어드는 순간 pageIndex가 범위를 벗어나면 보정
    setPageIndex((prev) => Math.max(0, Math.min(pages - 1, prev)));
  };

  useEffect(() => {
    requestAnimationFrame(recalcPages);
    setTimeout(recalcPages, 0);

    window.addEventListener("resize", recalcPages);
    return () => window.removeEventListener("resize", recalcPages);
  }, [posters.length]);

  // 스크롤 위치 -> pageIndex 계산 (ratio 방식)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (maxScrollLeft <= 0) {
        setPageIndex(0);
        return;
      }

      const ratio = el.scrollLeft / maxScrollLeft;
      const idx = Math.round(ratio * (totalPages - 1));
      setPageIndex(Math.max(0, Math.min(totalPages - 1, idx)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    // 초기 동기화
    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [posters.length, totalPages]);

  // 루프 판정은 pageIndex가 아니라 현재 스크롤 위치
  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const pageWidth = el.clientWidth;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    // 스크롤 위치가 아주 근접했을 때도 끝으로 인정 (오차 보정)
    const EPS = 2;
    const atStart = el.scrollLeft <= EPS;
    const atEnd = el.scrollLeft >= maxScrollLeft - EPS;

    if (direction === "right") {
      if (atEnd) {
        // 맨 끝에서 -> 맨 앞으로
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      el.scrollBy({ left: pageWidth, behavior: "smooth" });
      return;
    }

    // left
    if (atStart) {
      // 맨 앞에서 -> 맨 끝으로
      el.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: -pageWidth, behavior: "smooth" });
  };

  return (
    <section className={styles.row}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.dots}>
        {Array.from({ length: Math.min(totalPages, 12) }).map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === pageIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>

      <div className={styles.carousel}>
        {/* viewport: "hover 되기 전 포스터 높이"를 기준으로 만드는 영역
            arrow/edge의 높이는 viewport에 맞춰 고정되고,
            포스터 hover는 overflow-y: visible로 위아래로만 튀어나오게 됨 */}
        <div className={styles.viewport}>
          <div className={styles.edgeLeft} />
          <div className={styles.edgeRight} />

          <button
            className={`${styles.arrow} ${styles.leftArrow}`}
            onClick={() => scrollByPage("left")}
            aria-label="scroll left"
          >
            ‹
          </button>

          <button
            className={`${styles.arrow} ${styles.rightArrow}`}
            onClick={() => scrollByPage("right")}
            aria-label="scroll right"
          >
            ›
          </button>

          <div className={styles.posters} ref={scrollerRef}>
            {posters.map((m) => (
              <img
                key={m.id}
                className={styles.poster}
                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                alt={m.title ?? m.name ?? "poster"}
                onClick={() => onSelectMovie(m)}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
