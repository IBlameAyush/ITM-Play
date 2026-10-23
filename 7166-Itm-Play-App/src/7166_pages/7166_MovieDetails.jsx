
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovie() {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        const response = await fetch(
          `http://localhost:5000/api/7166/movies/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Movie not found."
              : "Unable to load movie details."
          );
        }

        const data = await response.json();
        setMovie(data.movie);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovie();

    return () => controller.abort();
  }, [id]);

  
async function addToWatchlist() {
  setSaving(true);
  setWatchlistMessage("");

  try {
    const response = await fetch(
      `http://localhost:5000/api/7166/auth/watchlist/${id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "Unable to save movie.");
    }

    setWatchlistMessage("Movie added to your library!");
  } catch (err) {
    setWatchlistMessage(
      err.message || "Unable to connect to the server."
    );
  } finally {
    setSaving(false);
  }
}


  if (loading) {
    return <main className="details-state">Loading movie...</main>;
  }

  if (error || !movie) {
    return (
      <main className="details-state">
        <h2>{error || "Movie not found."}</h2>
        <Link to="/movies" className="primary-button">
          Back to Movies
        </Link>
      </main>
    );
  }

  return (
    <main className="details-page">
      <div
        className="details-backdrop"
        style={{
          backgroundImage: movie.backdropUrl
            ? `linear-gradient(90deg, #101014 5%, #101014d9 55%, #10101466), linear-gradient(0deg, #101014, transparent), url("${movie.backdropUrl}")`
            : "linear-gradient(90deg, #101014, #252530)",
        }}
      />

      <section className="details-content">
        <img
          className="details-poster"
          src={movie.posterUrl || "/movie-placeholder.png"}
          alt={`${movie.title} poster`}
        />

        <div className="details-info">
          <p className="eyebrow">MOVIE DETAILS</p>

          <h1>{movie.title}</h1>

          <div className="details-meta">
            <span>{movie.releaseYear}</span>
            <span>★ {movie.rating ?? 0}/10</span>
            {movie.featured && <span>Featured</span>}
          </div>

          <div className="genre-list">
            {movie.genre?.map((item) => (
              <span key={item} className="genre-chip">
                {item}
              </span>
            ))}
          </div>

          <p className="details-description">
            {movie.description}
          </p>

          <div className="details-actions">
            <Link
              to={`/watch/${movie._id}`}
              className="primary-button"
            >
              ▶ Watch Movie
            </Link>

            <button
              type="button"
              className="secondary-button"
              onClick={addToWatchlist}
              disabled={saving}
            >
              {saving ? "Saving..." : "+ Add to Watchlist"}
            </button>

            {watchlistMessage && (
              <p className="details-note" role="status">
                {watchlistMessage}
              </p>
            )}

          </div>

          <p className="details-note">
            Sign in to save movies to your personal watchlist.
          </p>
        </div>
      </section>
    </main>
  );
}
