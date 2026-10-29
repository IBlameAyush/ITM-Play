import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../7166_components/7166_MovieCard.jsx";

const heroImages = [
  "https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "https://image.tmdb.org/t/p/w1280/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
  "https://image.tmdb.org/t/p/w1280/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
  "https://image.tmdb.org/t/p/w1280/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg",
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/7166/movies"
        );

        if (!response.ok) {
          throw new Error("Could not load movies.");
        }

        const data = await response.json();

        // Show only featured movies on the homepage
        const allMovies = data.movies || [];
        setMovies(
          allMovies.filter((movie) => movie.featured === true)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main>
      <section
        className="hero"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #101014 8%, #101014e8 48%, #10101433),
            linear-gradient(0deg, #101014, transparent 50%),
            url("${heroImages[heroIndex]}")
          `,
          backgroundPosition: "center, center, center 35%",
          backgroundSize: "cover, cover, cover",
          transition: "background-image 0.5s ease-in-out",
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">YOUR NEXT MOVIE NIGHT</p>

          <h1>
            Stories worth
            <br />
            staying up for.
          </h1>

          <p className="hero-description">
            Discover unforgettable movies, explore new worlds,
            and find your next favourite film.
          </p>

          <Link to="/movies" className="primary-button">
            Explore Movies →
          </Link>
        </div>
      </section>

      <section className="movie-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HANDPICKED FOR YOU</p>
            <h2>Featured Movies</h2>
          </div>

          <Link to="/movies" className="subtle-link">
            View all →
          </Link>
        </div>

        {loading && <p>Loading featured movies...</p>}

        {error && <p>Unable to load movies: {error}</p>}

        {!loading && !error && movies.length === 0 && (
          <p>
            No featured movies yet. Mark some movies as featured
            in the Admin Dashboard.
          </p>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
