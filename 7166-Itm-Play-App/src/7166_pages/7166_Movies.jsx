
import { useEffect, useState } from "react";
import MovieCard from "../7166_components/7166_MovieCard.jsx";

const GENRES = [
  "All Genres",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All Genres");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (genre !== "All Genres") {
          params.set("genre", genre);
        }

        const query = params.toString();
        const url = `http://localhost:5000/api/7166/movies${
          query ? `?${query}` : ""
        }`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not retrieve movies.");
        }

        const data = await response.json();
        setMovies(data.movies || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load movies. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => controller.abort();
  }, [search, genre]);

  return (
    <main className="browse-page">
      <header className="browse-header">
        <p className="eyebrow">FIND YOUR NEXT FAVOURITE</p>
        <h1>Explore Movies</h1>
        <p>
          Discover stories across genres, from timeless classics
          to thrilling adventures.
        </p>
      </header>

      <section className="browse-toolbar">
        <input
          type="search"
          className="movie-search"
          placeholder="Search movies by title..."
          aria-label="Search movies by title"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="genre-select"
          aria-label="Filter movies by genre"
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
        >
          {GENRES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <div className="results-heading">
        <h2>
          {genre === "All Genres" ? "All Movies" : genre}
        </h2>
        {!loading && (
          <span>{movies.length} movie(s)</span>
        )}
      </div>

      {loading && <p className="status-message">Loading movies...</p>}

      {!loading && error && (
        <p className="status-message error-message">{error}</p>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="empty-state">
          <h3>No movies found</h3>
          <p>Try another title or choose a different genre.</p>
          <button
            className="primary-button"
            onClick={() => {
              setSearch("");
              setGenre("All Genres");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {!error && movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}
