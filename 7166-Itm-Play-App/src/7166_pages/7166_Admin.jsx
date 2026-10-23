import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/7166/movies";

const emptyForm = {
  title: "",
  description: "",
  genre: "",
  releaseYear: new Date().getFullYear(),
  posterUrl: "",
  backdropUrl: "",
  videoUrl: "",
  rating: 0,
  featured: false,
};

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMovies() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API, { credentials: "include" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load movies.");
      }

      setMovies(data.movies || data.data?.movies || []);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "releaseYear" || name === "rating"
            ? value
            : value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  function startEditing(movie) {
    setEditingId(movie._id);
    setForm({
      title: movie.title || "",
      description: movie.description || "",
      genre: Array.isArray(movie.genre)
        ? movie.genre.join(", ")
        : movie.genre || "",
      releaseYear: movie.releaseYear || "",
      posterUrl: movie.posterUrl || "",
      backdropUrl: movie.backdropUrl || "",
      videoUrl: movie.videoUrl || "",
      rating: movie.rating ?? 0,
      featured: Boolean(movie.featured),
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      ...form,
      genre: form.genre
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      releaseYear: Number(form.releaseYear),
      rating: Number(form.rating),
    };

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save the movie.");
      }

      setMessage(editingId ? "Movie updated successfully." : "Movie added successfully.");
      setForm(emptyForm);
      setEditingId(null);
      await loadMovies();
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(movie) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API}/${movie._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete the movie.");
      }

      setMovies((previous) =>
        previous.filter((item) => item._id !== movie._id)
      );
      setMessage("Movie deleted successfully.");

      if (editingId === movie._id) resetForm();
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">ITMPLAY CONTROL CENTER</p>
          <h1>Admin Dashboard</h1>
          <p>Manage your movie collection from one place.</p>
        </div>

        <Link to="/movies" className="admin-back-link">
          ← View website
        </Link>
      </header>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>Total movies</span>
          <strong>{movies.length}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Featured movies</span>
          <strong>{movies.filter((movie) => movie.featured).length}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <h2>{editingId ? "Edit movie" : "Add a new movie"}</h2>

        {message && <p className="admin-success">{message}</p>}
        {error && <p className="admin-error">{error}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Movie title *
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </label>

          <label>
            Release year *
            <input
              name="releaseYear"
              type="number"
              value={form.releaseYear}
              onChange={handleChange}
              required
              min="1888"
              max="2100"
            />
          </label>

          <label>
            Genres * <span>(separate with commas)</span>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="Action, Sci-Fi, Drama"
              required
            />
          </label>

          <label>
            Rating (0–10)
            <input
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
            />
          </label>

          <label className="admin-full-width">
            Description *
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

          <label className="admin-full-width">
            Poster image URL
            <input
              name="posterUrl"
              type="url"
              value={form.posterUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-full-width">
            Backdrop image URL
            <input
              name="backdropUrl"
              type="url"
              value={form.backdropUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-full-width">
            Video URL
            <input
              name="videoUrl"
              type="url"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label className="admin-featured">
            <input
              name="featured"
              type="checkbox"
              checked={form.featured}
              onChange={handleChange}
            />
            Show as a featured movie
          </label>

          <div className="admin-form-actions admin-full-width">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update movie" : "Add movie"}
            </button>

            {editingId && (
              <button type="button" className="admin-cancel" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-list-heading">
          <h2>Movie library</h2>
          <button type="button" className="admin-refresh" onClick={loadMovies}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies found. Add your first movie above.</p>
        ) : (
          <div className="admin-movie-list">
            {movies.map((movie) => (
              <article className="admin-movie-row" key={movie._id}>
                {movie.posterUrl ? (
                  <img
                    className="admin-movie-poster"
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                  />
                ) : (
                  <div className="admin-movie-poster admin-no-poster">
                    No poster
                  </div>
                )}

                <div className="admin-movie-info">
                  <h3>{movie.title}</h3>
                  <p>
                    {movie.releaseYear} ·{" "}
                    {Array.isArray(movie.genre)
                      ? movie.genre.join(", ")
                      : movie.genre}
                  </p>
                  <span>
                    Rating: {movie.rating ?? "N/A"}
                    {movie.featured ? " · Featured" : ""}
                  </span>
                </div>

                <div className="admin-movie-actions">
                  <button type="button" onClick={() => startEditing(movie)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => handleDelete(movie)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}