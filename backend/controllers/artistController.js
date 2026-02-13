// config/db.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// GET /search?artistName=...
exports.searchArtist = (req, res) => {
    const { artistName } = req.query;

    if (!artistName) {
        return res.render("home", { message: "Please enter an artist name." });
    }

    const query = `
        SELECT a.name AS artist_name, g.name AS genre_name
        FROM artists a
        LEFT JOIN genres g ON a.genre_id = g.id
        WHERE a.name LIKE ?
    `;
    const searchValue = `%${artistName}%`;

    db.query(query, [searchValue], (err, results) => {
        if (err) {
            console.error(err);
            return res.render("home", { message: "Database error." });
        }

        if (results.length === 0) {
            return res.render("home", { message: "No artists found." });
        }

        res.render("home", { artists: results });
    });
};
