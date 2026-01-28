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
  return useMemo(() => new URLSearchParams(search).get(name) ?? "", [search, name]);
}

export default function SearchPage() {
  const q = useQueryParam("q");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Movie | null>(null);

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
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        // 넷플릭스처럼 "영화+시리즈 통합" 느낌: search/multi 사용
        const res = await tmdb.get<{ results: SearchItem[] }>(
          `/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
            trimmed
          )}&language=ko-KR&include_adult=false`
        );

        // person(인물) 섞이면 포스터/모달 처리 애매하니 movie/tv만 필터링
        const filtered = (res.data.results ?? []).filter(
          (it) => (it.media_type === "movie" || it.media_type === "tv") && it.poster_path
        );

        setItems(filtered);
      } catch (e) {
        setError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [q]);

  return (
    <>
    <Nav/>
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

        {selected && (
            <MovieModal movie={selected} onClose={() => setSelected(null)} />
        )}
        </div>
    </>
  );
}
