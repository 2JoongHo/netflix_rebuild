// 넷플릭스 시리즈 페이지 컴포넌트

import { useState } from "react";
import requests from "../api/requests";
import Banner from "../components/Banner";
import MovieModal from "../components/MovieModal/MovieModal";
import Nav from "../components/Nav";
import Row from "../components/Row";
import type { Movie } from "../types/movie";

export default function TvPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div style={{ paddingTop: 64 }}>
      <Nav />
      <Banner fetchUrl={requests.tv.fetchTrending} />

      <Row
        title="지금 뜨는 콘텐츠"
        fetchUrl={requests.tv.fetchTrending}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="평점 높은 콘텐츠"
        fetchUrl={requests.tv.fetchTopRated}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="액션&어드벤처 시리즈"
        fetchUrl={requests.tv.fetchActionSeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="애니메이션"
        fetchUrl={requests.tv.fetchAnimationSeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="코미디"
        fetchUrl={requests.tv.fetchComedySeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="다큐멘터리"
        fetchUrl={requests.tv.fetchDocumentarySeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="드라마"
        fetchUrl={requests.tv.fetchDramaSeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="어린이 드라마"
        fetchUrl={requests.tv.fetchKidSeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="미스테리쇼"
        fetchUrl={requests.tv.fetchMysterySeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="리얼리티쇼"
        fetchUrl={requests.tv.fetchRealitySeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="판타지 시리즈"
        fetchUrl={requests.tv.fetchFantasySeries}
        onSelectMovie={setSelectedMovie}
      />
      <Row
        title="토크쇼"
        fetchUrl={requests.tv.fetchTalkSeries}
        onSelectMovie={setSelectedMovie}
      />

      {/* 선택된 영화가 있을 때만 모달 보여주기 */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
