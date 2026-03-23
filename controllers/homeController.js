const db = require("../config/database");

// 1️⃣ Trending Genres (for template or API)
exports.renderTrendingGenres = (req, res) => {
  const query = `
    SELECT g.id, g.name, g.banner_image, COUNT(r.id) AS recent_releases
    FROM releases r
    JOIN genres g ON g.id = r.genre_id
    WHERE r.release_date >= CURDATE() - INTERVAL 14 DAY
    GROUP BY g.id, g.name, g.banner_image
    ORDER BY recent_releases DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.render("home", { message: "Error loading trending genres" });
    }

    res.render("home", { trendingGenres: results });
  });
};

// 2️⃣ Suggested Artists
exports.renderSuggestedArtists = (req, res) => {
  const genreId = req.query.genre_id; // optional filter

  const query = `
    SELECT id, name, profile_image
    FROM artists
    WHERE genre_id = ?
    ORDER BY RAND()
    LIMIT 10
  `;

  db.query(query, [genreId], (err, results) => {
    if (err) {
      console.error(err);
      return res.render("home", { message: "Error loading suggested artists" });
    }

    res.render("home", { suggestedArtists: results });
  });
};

// 3️⃣ New Releases
exports.renderNewReleases = (req, res) => {
  const query = `
    SELECT r.id, r.title, r.cover_image, r.release_date, a.name AS artist_name
    FROM releases r
    JOIN artists a ON a.id = r.artist_id
    ORDER BY r.release_date DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.render("home", { message: "Error loading new releases" });
    }

    res.render("home", { newReleases: results });
  });
};
