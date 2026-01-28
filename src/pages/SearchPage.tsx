// 검색창 페이지 컴포넌트

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import tmdb from "../api/tmdb";
import MovieModal from "../components/MovieModal/MovieModal";
import Nav from "../components/Nav";
import type { Movie } from "../types/movie";

// 검색 결과는 movie/tv/person이 섞여 올 수 있어서 media_type을 포함한 타입을 하나 더 만든다
type SearchItem = Movie & {
  media_type?: "movie" | "tv" | "person";
};

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(
    () => new URLSearchParams(search).get(name) ?? "",
    [search, name]
  );
}

export default function SearchPage() {
  const q = useQueryParam("q");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null);

  // 페이지네이션 상태 (컴포넌트 안에 있어야 함)
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // 다음 페이지 불러오기(더 보기 버튼)
  const loadMore = async () => {
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const trimmed = q.trim();
    if (!API_KEY || !trimmed) return;

    const nextPage = page + 1;

    setLoading(true);
    setError(null);

    try {
      const res = await tmdb.get<{
        results: SearchItem[];
        page: number;
        total_pages: number;
      }>(
        `/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          trimmed
        )}&language=ko-KR&include_adult=false&page=${nextPage}`
      );

      const filtered = (res.data.results ?? []).filter(
        (it) =>
          (it.media_type === "movie" || it.media_type === "tv") &&
          it.poster_path
      );

      // 기존 결과 + 새 결과 누적
      setItems((prev) => [...prev, ...filtered]);

      // 현재 페이지 갱신
      setPage(nextPage);

      // 더 가져올 페이지가 있는지
      setHasMore(res.data.page < res.data.total_pages);
    } catch {
      setError("추가 결과를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    if (!API_KEY) {
      setError("TMDB API KEY가 없습니다. .env를 확인해주세요");
      return;
    }

    const trimmed = q.trim();
    if (!trimmed) {
      setItems([]);
      setError(null);
      setPage(1);
      setHasMore(false);
      return;
    }

    // q가 바뀌면 초기화
    setItems([]);
    setPage(1);
    setHasMore(false);

    const fetchFirstPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await tmdb.get<{
          results: SearchItem[];
          page: number;
          total_pages: number;
        }>(
          `/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
            trimmed
          )}&language=ko-KR&include_adult=false&page=1`
        );

        const filtered = (res.data.results ?? []).filter(
          (it) =>
            (it.media_type === "movie" || it.media_type === "tv") &&
            it.poster_path
        );

        setItems(filtered);

        // 다음 페이지가 있으면 true
        setHasMore(res.data.page < res.data.total_pages);
      } catch {
        setError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [q]);

  return (
    <>
      <Nav />

      <div style={{ paddingTop: 80, paddingLeft: 24, paddingRight: 24 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 800 }}>
          {q.trim() ? `"${q}" 검색 결과` : "검색어를 입력해주세요"}
        </h2>

        {loading && <p style={{ opacity: 0.8 }}>검색 중…</p>}
        {error && <p style={{ opacity: 0.8 }}>{error}</p>}

        {!loading && !error && q.trim() && items.length === 0 && (
          <p style={{ opacity: 0.8 }}>결과가 없습니다.</p>
        )}

        {/* 검색 결과: 그리드로 보여주기 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 14,
          }}
        >
          {items.map((it) => (
            <button
              key={`${it.media_type}-${it.id}`}
              onClick={() => setSelected(it)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
              aria-label="open result"
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${it.poster_path}`}
                alt={it.title ?? it.name ?? "poster"}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  display: "block",
                }}
                loading="lazy"
                decoding="async"
              />

              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
                {it.title ?? it.name ?? "Untitled"}
              </div>

              <div style={{ marginTop: 2, fontSize: 12, opacity: 0.6 }}>
                {it.media_type === "movie" ? "영화" : "시리즈"}
              </div>
            </button>
          ))}
        </div>

        {/* 그리드 아래: 더 보기 버튼 */}
        {hasMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "22px 0 40px",
            }}
          >
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.3)",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "불러오는 중…" : "더 보기"}
            </button>
          </div>
        )}

        {/* 모달 */}
        {selected && (
          <MovieModal movie={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </>
  );
}
