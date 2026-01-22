import Nav from "../components/layout/Nav";
import Banner from "../components/movies/Banner/Banner";

export default function Home() {
    return (
        <div style={{paddingTop: 64}}>
            <Nav />
            <Banner />
            <h1>Netflix Rebuild</h1>
        </div>
    )
}