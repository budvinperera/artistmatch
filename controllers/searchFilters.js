const db = require('../config/db');

// GET /search/filter?role=Producer&genre=House&location=Sri Lanka
const filterArtists = (req, res) => {
    const { role, genre, gender, language, artist_exp, location } = req.query;

    // start with a base query
    let query = `SELECT artistID, artistName, artistStageName, genre, 
                 vocalistType, songwriterType, instrumentType, 
                 experienceYears, country
                 FROM Artist WHERE 1=1`;
    const params = [];

    // only add conditions for filters that were actually selected
    if (role) {
        query += ` AND artistRoles LIKE ?`;
        params.push(`%${role}%`);
    }
    if (genre) {
        query += ` AND genre LIKE ?`;
        params.push(`%${genre}%`);
    }
    if (gender) {
        query += ` AND gender = ?`;
        params.push(gender);
    }
    if (language) {
        query += ` AND language LIKE ?`;
        params.push(`%${language}%`);
    }
    if (artist_exp) {
        query += ` AND experienceYears = ?`;
        params.push(artist_exp);
    }
    if (location) {
        query += ` AND country LIKE ?`;
        params.push(`%${location}%`);
    }

    query += ` ORDER BY artistName ASC`;

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Filter error:", err);
            return res.status(500).json({ message: "Something went wrong." });
        }
        if (results.length === 0) {
            return res.status(200).json({ message: "No artists found.", artists: [] });
        }
        return res.status(200).json({ artists: results });
    });
};

module.exports = { filterArtists };