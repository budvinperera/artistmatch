const db = require("../config/db");

exports.renderHome = (req, res) => {
  const trendingQuery = `
    SELECT g.id, g.name, g.banner_image, COUNT(r.id) AS recent_releases
    FROM releases r
    JOIN genres g ON g.id = r.genre_id
    WHERE r.release_date >= CURDATE() - INTERVAL 14 DAY
    GROUP BY g.id, g.name, g.banner_image
    ORDER BY recent_releases DESC
    LIMIT 10
  `;

  const suggestedQuery = `
    SELECT id, name, profile_image
    FROM artists
    ORDER BY RAND()
    LIMIT 10
  `;

  const releasesQuery = `
    SELECT r.id, r.title, r.cover_image, r.release_date, a.name AS artist_name
    FROM releases r
    JOIN artists a ON a.id = r.artist_id
    ORDER BY r.release_date DESC
    LIMIT 10
  `;

  db.query(trendingQuery, (err, trendingGenres) => {
    if (err) return res.render("home", { message: "Error loading home" });

    db.query(suggestedQuery, (err, suggestedArtists) => {
      if (err) return res.render("home", { message: "Error loading home" });

      db.query(releasesQuery, (err, newReleases) => {
        if (err) return res.render("home", { message: "Error loading home" });

        res.render("home", {
          trendingGenres,
          suggestedArtists,
          newReleases
        });
      });
    });
  });
};
