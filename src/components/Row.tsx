// 넷플릭스 스타일의 가로 스크롤 영화 목록 컴포넌트

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
  // TMDB에서 받아온 영화 목록
  const [movies, setMovies] = useState<Movie[]>([]);

  // 스크롤되는 영역을 JS로 제어하기 위한 ref
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // 현재 페이지(한 화면 단위) 인덱스
  const [pageIndex, setPageIndex] = useState<number>(0);

  // 총 페이지 수(도트 개수 계산용) — useMemo 대신 state로 안정화
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

  // poster_path 있는 것만 렌더링
  const posters = useMemo(() => movies.filter((m) => m.poster_path), [movies]);

  // 페이지 수 재계산 함수
  const recalcPages = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setTotalPages(pages);
  };

  // posters가 바뀌거나, 화면이 리사이즈되면 페이지 수 재계산
  useEffect(() => {
    // 이미지 로딩/레이아웃 반영 이후를 잡기 위해 타이밍을 두 번 주기
    requestAnimationFrame(recalcPages);
    setTimeout(recalcPages, 0);

    window.addEventListener("resize", recalcPages);
    return () => window.removeEventListener("resize", recalcPages);
  }, [posters.length]);

  // 스크롤할 때 현재 페이지 인덱스 업데이트
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPageIndex(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    // 초기값 세팅
    onScroll();
    recalcPages();

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [posters.length]);

  // 화살표 클릭 시 한 화면 단위로 이동
  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.row}>
      <h3 className={styles.title}>{title}</h3>

      {/* 도트는 깜빡이지 않게 항상 렌더하고 css에서 필요하면 투명도 조절 */}
      <div className={styles.dots}>
        {Array.from({ length: Math.min(totalPages, 12) }).map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === pageIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>

      {/* 화살표/그라데이션 높이를 포스터 영역에 맞추기 위해 wrapper(=carousel)로 감싸기 */}
      <div className={styles.carousel}>
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
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              alt={m.title ?? m.name ?? "poster"}
              onClick={() => onSelectMovie(m)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
