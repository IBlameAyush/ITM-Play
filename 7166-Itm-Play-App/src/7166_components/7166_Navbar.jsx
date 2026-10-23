
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ user, authLoading, onLogout }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/7166/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      onLogout();
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      setLogoutError(error.message);
    } finally {
      setLoggingOut(false);
    }
  }

  const displayName = user?.name || user?.username || user?.email;
  const initial = (displayName || "U").charAt(0).toUpperCase();

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Movies", to: "/movies" },
    { label: "My Library", to: "/library" },
  ];

  return (
    <>
      <header className="navbar">
        <Link
          to="/"
          className="brand"
          aria-label="itmPlay home"
          onClick={() => setMenuOpen(false)}
        >
          itm<span>Play</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-auth">
          {authLoading ? (
            <span className="nav-loading">Checking account...</span>
          ) : user ? (
            <div className="nav-account">
              <button
                type="button"
                className={`nav-profile-button ${
                  menuOpen ? "is-open" : ""
                }`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="nav-avatar">{initial}</span>
                <span className="nav-user">
                  Hi, {displayName || "User"}
                </span>
                <span className="nav-chevron">
                  {menuOpen ? "⌃" : "⌄"}
                </span>
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="nav-menu-backdrop"
                    aria-label="Close account menu"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="nav-account-menu">
                    <div className="nav-account-info">
                      <span className="nav-avatar nav-avatar-large">
                        {initial}
                      </span>
                      <div className="nav-account-text">
                        <strong>{displayName || "User"}</strong>
                        <span>Signed in to itmPlay</span>
                      </div>
                    </div>

                    <div className="nav-menu-divider" />

                    <Link
                      to="/library"
                      className="nav-menu-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Library
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="nav-menu-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      className="nav-menu-logout"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? "Logging out..." : "Log out"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-signin">
              Sign in <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </header>

      {logoutError && (
        <p className="auth-error" role="alert">
          {logoutError}
        </p>
      )}
    </>
  );
}
