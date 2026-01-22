import Nav from "../components/layout/Nav";
import Banner from "../components/movies/Banner/Banner";
import Row from "../components/movies/Row/Row";
import requests from "../api/requests";

export default function Home() {
  return (
    <div style={{ paddingTop: 64 }}>
      <Nav />
      <Banner />

      <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
    </div>
  );
}
