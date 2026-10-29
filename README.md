# itmPlay: Movie Streaming Platform

A full-stack movie streaming web application built with the **MERN stack** for the Advanced Web Development (AWD) subject, B.Tech Semester 5. Movie data comes from the **TMDB API**, the interface uses animated **React Bits** components, and the backend is hardened with **Helmet, Joi, bcrypt and rate limiting**.

**Group Code:** 7166

| Name | 
|---|
| Jinit Shah | 
| Ayush Yadav | 

---

## Features

**For viewers**
- Animated landing page with a hero section, live stats and an auto-playing **featured carousel**
- Horizontal poster rails (Featured, Latest Additions, Top Rated) with slide buttons
- Browse all movies, search by title and filter by genre
- Movie details page with poster, backdrop, genres, rating and description
- Watch page that plays trailers (YouTube embed) or direct video files
- Register, log in and log out with cookie-based JWT authentication
- Personal **watchlist ("My Library")**

**For administrators**
- Admin dashboard to add, edit and delete movies, with live stats
- Role-based access control enforced on the backend

**Data**
- One-command import of popular movies, posters, backdrops, genres, ratings and trailers from **TMDB**

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| UI effects | React Bits (BlurText, ShinyText, CountUp, FadeContent, SpotlightCard, optional Aurora) |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT in an httpOnly cookie |
| Security | bcrypt, Helmet, Joi, express-rate-limit, CORS |
| External data | TMDB API (server-side import) |

## Project Structure

```
ITM-Play/
├── client/
│   └── src/
│       ├── main.jsx
│       ├── 7166_main.jsx
│       ├── 7166_App.jsx
│       ├── 7166_index.css
│       ├── 7166_components/
│       │   ├── 7166_Navbar.jsx
│       │   ├── 7166_MovieCard.jsx
│       │   ├── 7166_FeaturedCarousel.jsx
│       │   └── reactbits/            # copied React Bits components
│       └── 7166_pages/
│           ├── 7166_Home.jsx
│           ├── 7166_Movies.jsx
│           ├── 7166_MovieDetails.jsx
│           ├── 7166_Watch.jsx
│           ├── 7166_Login.jsx
│           ├── 7166_Register.jsx
│           ├── 7166_Library.jsx
│           └── 7166_Admin.jsx
└── server/
    ├── 7166_server.js                # entry point
    ├── 7166_app.js                   # Express app, middleware, routes
    ├── 7166_importTmdb.js            # TMDB import script
    ├── 7166_config/7166_db.js        # MongoDB connection
    ├── 7166_middleware/
    │   ├── 7166_auth.js              # JWT verification
    │   ├── 7166_admin.js             # admin role check
    │   └── 7166_validate.js          # Joi schemas and middleware
    ├── 7166_models/
    │   ├── 7166_User.js
    │   └── 7166_Movie.js
    └── 7166_routes/
        ├── 7166_authRoutes.js
        └── 7166_movieRoutes.js
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- MongoDB Community Server running locally (or a MongoDB Atlas connection string). MongoDB Compass is only a viewer, so the server must be running.
- A free [TMDB](https://www.themoviedb.org/) account for the movie import

### 1. Clone the repository

```bash
git clone https://github.com/IBlameAyush/Movie-Play.git
cd Movie-Play
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/moviestreaming
JWT_SECRET=replace_with_a_long_random_string
NODE_ENV=development
TMDB_TOKEN=your_tmdb_read_access_token
```

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the server:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

You should see `MongoDB connected successfully` and `Server running on port 5000`. Health check: `http://localhost:5000/api/7166/health`.

### 3. Import movies from TMDB

1. On themoviedb.org go to **Settings, then API** and copy the **API Read Access Token**.
2. Put it in `.env` as `TMDB_TOKEN`.
3. Run once from the `server` folder:

```bash
node 7166_importTmdb.js
```

This imports about 60 popular movies with posters, backdrops, genres, ratings and YouTube trailers, and marks the first six as featured. It is safe to run again, because it updates existing movies instead of duplicating them. Change `PAGES` at the top of the script to import more.

### 4. Frontend setup

```bash
cd client
npm install
npm install motion gsap     # React Bits dependencies (add ogl if you use Aurora)
npm run dev
```

The app runs at `http://localhost:5173`. The backend only allows requests from `http://localhost:5173` and `http://127.0.0.1:5173`, and the frontend sends `credentials: "include"` so the login cookie is used.

### 5. Create an admin user

New accounts get the role `user`. To make an admin:

1. Register normally in the app.
2. In MongoDB Compass open `moviestreaming`, then `users`.
3. Change your user's `role` from `"user"` to `"admin"`.
4. Log out and log in again.

## API Reference

Base URL: `http://localhost:5000/api/7166`

### Authentication (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create an account |
| POST | `/login` | Public | Log in and set the cookie |
| GET | `/me` | Logged in | Current user and role |
| POST | `/logout` | Public | Clear the cookie |
| GET | `/watchlist` | Logged in | Get saved movies |
| POST | `/watchlist/:movieId` | Logged in | Add a movie to the watchlist |
| DELETE | `/watchlist/:movieId` | Logged in | Remove a movie from the watchlist |

### Movies (`/movies`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List movies (`?search=` and `?genre=`) |
| GET | `/:id` | Public | Get one movie |
| POST | `/` | Admin | Create a movie |
| PUT | `/:id` | Admin | Update a movie |
| DELETE | `/:id` | Admin | Delete a movie |

**Movie fields:** `title`, `description`, `genre` (array), `releaseYear`, `posterUrl`, `backdropUrl`, `videoUrl`, `rating` (0 to 10), `featured`.

## UI Highlights (React Bits)

[React Bits](https://reactbits.dev) components are copied into `client/src/7166_components/reactbits/` (JavaScript + CSS variants).

| Where | Component | Effect |
|---|---|---|
| Home hero | BlurText, ShinyText | Animated headline and shimmering label |
| Home hero | CountUp | Animated movie, genre and featured counters |
| Poster rails | FadeContent | Rows fade in on scroll |
| Movie cards | SpotlightCard | Glow that follows the cursor |
| Auth pages (optional) | Aurora | Animated background |

The featured carousel (`7166_FeaturedCarousel.jsx`) is a custom component with autoplay, pause on hover, arrows and dots. The poster rails have their own slide buttons.

## Security Measures

- Passwords hashed with **bcrypt** (12 salt rounds) and excluded from queries with `select: false`
- JWT in an **httpOnly** cookie with `sameSite: lax`, and `secure` in production
- Admin role read from the database on every admin request, never from the request body
- **Helmet** for secure HTTP headers
- **Joi** schemas for input validation, with `http`/`https` only for media URLs
- **express-rate-limit** on login and register against brute force
- Field whitelist and ObjectId validation on the movie routes
- CORS limited to the frontend origin
- Secrets kept in `.env`, which is never committed; the TMDB token stays on the server

## AWD Final Viva Tasks

This project is the basis for the three viva tasks:

1. **Comparative Technology Study:** JWT vs sessions, REST vs GraphQL, MongoDB vs MySQL, React vs Angular
2. **Security Audit Report:** findings with risk levels, impact and fixes
3. **Security Libraries:** Helmet, bcrypt and Joi, integrated and demonstrated

## Known Limitations and Future Work

- The JWT lasts 7 days and cannot be revoked; a refresh-token flow would improve this
- The title search should escape special characters before using a regular expression
- Movies come from TMDB, which provides trailers, not full films
- Some trailers cannot be embedded if their owner disabled embedding
- Genres such as Family or Mystery are not in the Movies page dropdown yet
- HTTPS and production environment settings are required before deployment

## Credits

- Movie data and images provided by [TMDB](https://www.themoviedb.org/). *This product uses the TMDB API but is not endorsed or certified by TMDB.*
- UI components from [React Bits](https://reactbits.dev)
- Built for academic purposes

## License

This project was created for academic purposes.
