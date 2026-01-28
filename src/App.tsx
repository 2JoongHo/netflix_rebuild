import { Navigate, Route, Routes } from "react-router-dom";
import { default as MoviesPage } from "./pages/MoviesPage";
import SearchPage from "./pages/SearchPage";
import TvPage from "./pages/TvPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="movies" replace />} />
      <Route path="/movies" element={<MoviesPage/>}/>
      <Route path="/tv" element={<TvPage/>}/>
      <Route path="/search" element={<SearchPage/>}/>
    </Routes>
  )
}