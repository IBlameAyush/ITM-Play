
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../7166_components/7166_MovieCard.jsx";

const AUTH_URL = "http://localhost:5000/api/7166/auth";

export default function Library() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${AUTH_URL}/watchlist`, {
        credentials: "include",
      });
      const data = await response.json();

      if (response.status === 401) {
        setError("Please log in to view your library.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not load your library.");
      }

      setMovies(data.movies || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  async function removeMovie(movieId) {
    setRemovingId(movieId);
    setError("");

    try {
      const response = await fetch(
        `${AUTH_URL}/watchlist/${movieId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove movie.");
      }

      setMovies((current) =>
        current.filter((movie) => movie._id !== movieId)
      );
    } catch (err) {
      setError(err.message || "Unable to remove movie.");
    } finally {
      setRemovingId("");
    }
  }

  if (loading) {
    return <main className="browse-page">Loading your library...</main>;
  }

  if (error === "Please log in to view your library.") {
    return (
      <main className="browse-page empty-state">
        <h1>Your Library</h1>
        <p>Sign in to save and manage your favourite movies.</p>
        <Link to="/login" className="primary-button">
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="browse-page">
      <header className="browse-header">
        <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>My Library</h1>
        <p>Movies you've saved to watch later.</p>
      </header>

      {error && <p className="auth-error">{error}</p>}

      <div className="results-heading">
        <h2>Watchlist</h2>
        <span>{movies.length} movie(s)</span>
      </div>

      {movies.length === 0 ? (
        <div className="empty-state">
          <h3>Your library is empty</h3>
          <p>Explore the catalogue and add a movie to get started.</p>
          <Link to="/movies" className="primary-button">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="library-item" key={movie._id}>
              <MovieCard movie={movie} />
              <button
                className="remove-watchlist-button"
                disabled={removingId === movie._id}
                onClick={() => removeMovie(movie._id)}
              >
                {removingId === movie._id
                  ? "Removing..."
                  : "− Remove from Library"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
