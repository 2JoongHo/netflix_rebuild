import { useState } from "react";
import requests from "../api/requests";
import Banner from "../components/Banner";
import MovieModal from "../components/MovieModal/MovieModal";
import Nav from "../components/Nav";
import Row from "../components/Row";
import type { Movie } from "../types/movie";

export default function TvPage() {

    const [selectedMovie, setSelectedMovie] = useState<Movie | null> (null);

  return (
    <div style={{ paddingTop: 64 }}>
        <Nav />
        <Banner fetchUrl={requests.tv.fetchTrending}/>

        <Row title="지금 뜨는 콘텐츠" fetchUrl={requests.tv.fetchTrending} onSelectMovie={setSelectedMovie}/>
        <Row title="평점 높은 콘텐츠" fetchUrl={requests.tv.fetchTopRated} onSelectMovie={setSelectedMovie}/>
        <Row title="액션 영화" fetchUrl={requests.tv.fetchActionMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="공포 영화" fetchUrl={requests.tv.fetchHorrorMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="로맨스 영화" fetchUrl={requests.tv.fetchRomanceMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="만화 영화" fetchUrl={requests.tv.fetchAnimationMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="SF 영화" fetchUrl={requests.tv.fetchSFMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="판타지 영화" fetchUrl={requests.tv.fetchFantasyMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="스릴러 영화" fetchUrl={requests.tv.fetchThrillerMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="미스테리 영화" fetchUrl={requests.tv.fetchMysteryMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="가족 영화" fetchUrl={requests.tv.fetchFamilyMovies} onSelectMovie={setSelectedMovie}/>
        <Row title="코미디 영화" fetchUrl={requests.tv.fetchComedyMovies} onSelectMovie={setSelectedMovie}/>

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
