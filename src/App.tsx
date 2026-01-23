import { Navigate, Route, Routes } from "react-router-dom";
import { default as MoviesPage, default as TvPage } from "./pages/TvPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="movies" replace />} />
      <Route path="/movies" element={<MoviesPage/>}/>
      <Route path="/tv" element={<TvPage/>}/>
    </Routes>
  )
}