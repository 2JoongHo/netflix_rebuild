// 넷플릭스 모달 페이지 컴포넌트

import { useState } from "react";
import close_btn from "../../images/x_btn.svg";
import { Movie } from "../../types/movie";
import VideoModal from "../VideoModal/VideoModal";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [openVideo, setOpenVideo] = useState(false);
  const title = movie.title ?? movie.name ?? "Untitled";
  const overview = movie.overview ?? "설명이 없습니다.";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const mediaType = (movie.media_type as "movie" | "tv") ?? "movie";

  return (
    <>
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.hero}
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
          }}
        >
          <button className={styles.close} onClick={onClose}>
            <img className={styles.close_btn} src={close_btn} alt="Close" />
          </button>
          <button className={styles.play_btn} onClick={() => setOpenVideo(true)}>
            ▶ 재생
          </button>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.overview}>{overview}</p>
        </div>
      </div>
    </div>

    // VideoModal
    {openVideo && (
      <VideoModal
        id={movie.id}
        mediaType={mediaType}
        onClose={() => setOpenVideo(false)}
      />
    )}
    </>
  );
}
