import { useEffect, useMemo, useRef, useState } from "react";
import tmdb from "../api/tmdb";
import type { Movie } from "../types/movie";
import styles from "./Row.module.css";

interface RowProps {
  title: string; // Row 제목
  fetchUrl: string; // TMDB 요청 주소
  onSelectMovie: (movie: Movie) => void;
}

export default function Row({ title, fetchUrl, onSelectMovie }: RowProps) {
  // TMDB에서 받아온 영화를 저장하는 state
  const [movies, setMovies] = useState<Movie[]>([]);

  // 스크롤 되는 posters div를 코드로 제어하기 위한 ref
  // 화살표 클릭 시 scrollBy로 밀어주기위해 필요함
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // 현재 몇 번째 페이지인지 기억하는 state
  // 도트 인디케이터
  const [pageIndex, setPageIndex] = useState<number>(0);


  useEffect(() => {
    // 비동기 응답이 늦게 와도 안전하게 처리
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        // TS 제네릭 : 응답 데이터가 { results: Movie[] } 형태임을 알려줌
        const response = await tmdb.get<{results: Movie[] }> (fetchUrl);

        // results가 없을 경우 빈 배열로 대체
        if (isMounted) setMovies(response.data.results ?? []);
      } catch (e) {
        // 네트워크 에러 등 실패 시 빈 배열
        if (isMounted) setMovies([]);
      }
    };
    fetchMovies();


    // 컴포넌트가 사라질 때 isMounted를 false로 만들어 setState 방지
    return () => {
      isMounted = false;
    }
  }, [fetchUrl]);

  /**
   * poster_path가 있는 항목만 사용
   * 포스터 없는 영화는 이미지를 만들 수 없어서 렌더링 제외
   */
  const posters = useMemo(
    () => movies.filter((m) => m.poster_path), [movies]
  );

  /**
   * 총 페이지 수 계산
   * 넷플릭스의 화살표는 보통 한 화면씩 이동
   * 전체 스크롤 너비 / 현재 화면 너비 = 대략 몇 페이지인지 계산
   */
  const totalPages = useMemo(() => {
    const el = scrollerRef.current;
    if (!el) return 0;

    return Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
  }, [posters.length]);

  /**
   * 스크롤할 때 pageIndex 업데이트
   * 사용자가 마우스로 직접 스크롤해도
   * 도트 표시가 따라오게 만들기
   */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPageIndex(idx);
    };

    el.addEventListener("scroll", onScroll, {passive: true});
    onScroll(); // 초기에도 한번 계산하기

    return () => {
      el.addEventListener("scroll", onScroll);
    };
  }, [posters.length]);

  /**
   * 화살표 클릭 시 한 화면 단위로 이동
   */
  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = el.clientWidth; // 한번에 이동할 거리 = 현재 보이는 영역 너비
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.row}>
      <h3 className={styles.title}>{title}</h3>

      {/* 페이지 표시(도트) */}
      <div className={styles.dots}>
        {Array.from({length: Math.min(totalPages, 10) }).map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === pageIndex ? styles.dotActive: ""}`}
          />
        ))}
      </div>

      {/* 양쪽 그라데이션 (끝이 있다는 느낌) */}
      <div className={styles.edgeLeft}/>
      <div className={styles.edgeRight}/>

      {/* 좌우 화살표 버튼 */}
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

      {/* 실제 포스터 줄(스크롤 영역) */}
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
    </section>
  );
}
