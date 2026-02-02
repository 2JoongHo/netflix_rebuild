// 재생버튼 클릭 시 비디오 모달 컴포넌트

import { useEffect, useState } from "react";
import tmdb from "../../api/tmdb";
import close_btn from "../../images/x_btn.svg";
import styles from "./VideoModal.module.css";

type MediaType = "movie" | "tv";

interface VideoModalProps {
  id: number;
  mediaType: MediaType;
  onClose: () => void;
}

export default function VideoModal({
  id,
  mediaType,
  onClose,
}: VideoModalProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // id가 없을 경우 요청 안함
    if (!id) return;
    let alive = true;

    async function fetchTrailer() {
      try {
        setLoading(true);

        // 영화나 드라마에 맞는 트레일러 API 호출
        const res = await tmdb.get(`/${mediaType}/${id}/videos`, {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
          },
        });

        // YouTube Trailer 또는 Teaser만 선택
        const picked =
          res.data.results?.find(
            (v: any) =>
              v.site === "YouTube" &&
              (v.type === "Trailer" || v.type === "Teaser"),
          ) ?? null;

        if (!alive) return;
        setVideoKey(picked?.key ?? null);
      } catch (e) {
        if (!alive) return;
        setVideoKey(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }
    fetchTrailer();

    // 컴포넌트 언마운트 시 state 업데이트 방지
    return () => {
      alive = false;
    };
  }, [id, mediaType]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <img className={styles.close_btn} src={close_btn} alt="Close" />
        </button>

        {loading ? (
          <div className={styles.fallback}>로딩중...</div>
        ) : !videoKey ? (
          <div className={styles.fallback}>트레일러가 없습니다.</div>
        ) : (
        <iframe
            className={styles.iframe}
            key={`${videoKey}=${isMuted}`}
            src={`https://www.youtube.com/embed/${videoKey}?controls=1&autoplay=1&loop=1&mute=${isMuted ? 1 : 0}&playlist=${videoKey}`}
            title="YouTube trailer"
            allow="autoplay; fullscreen"
            allowFullScreen
        />
        )}
      </div>
    </div>
  );
}
