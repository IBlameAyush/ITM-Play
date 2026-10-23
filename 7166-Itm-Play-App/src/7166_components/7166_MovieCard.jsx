
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="movie-card"
    >
      <img
        src={movie.posterUrl || "/movie-placeholder.png"}
        alt={movie.title}
        loading="lazy"
      />

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>
          {movie.releaseYear} · {movie.genre?.join(", ")}
        </p>
        <p>★ {movie.rating ?? 0}/10</p>
      </div>
    </Link>
  );
}
