// suggestedArtistsController.js
// Shows artists the user is NOT already following

const db = require('../config/database');

// GET /suggested?userName=...
// Example: /suggested?userName=john123
exports.getSuggestedArtists = (req, res) => {

    const { userName } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "Please provide a userName." });
    }

    const query = `
        SELECT a.artistID, a.artistName, a.artistStageName, a.genre
        FROM Artist a
        WHERE a.artistID NOT IN (
            SELECT artistID 
            FROM User_Follows_Artist 
            WHERE userName = ?
        )
        ORDER BY RAND()
        LIMIT 10
    `;

    db.query(query, [userName], (err, results) => {

        if (err) {
            console.error("Error getting suggested artists:", err);
            return res.status(500).json({ message: "Something went wrong." });
        }

        if (results.length === 0) {
            return res.status(200).json({ message: "No suggestions available.", suggested: [] });
        }

        return res.status(200).json({ suggested: results });
    });

};