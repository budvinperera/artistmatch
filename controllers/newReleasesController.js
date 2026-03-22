// newReleasesController.js
// Shows recent beats from artists the user follows

const db = require('../config/database');

// GET /new-releases?userName=...
// Example: /new-releases?userName=john123
exports.getNewReleases = (req, res) => {

    const { userName } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "Please provide a userName." });
    }

    // Get beats from artists the user follows
    // The subquery gets all artistIDs the user follows
    // Then we find beats where the producerID matches those artists
    const query = `
        SELECT b.beatID, b.beatName, b.price, b.genre, b.beatDetails, b.producerID,
               a.artistName, a.artistStageName
        FROM Beats b
        JOIN Artist a ON b.producerID = a.artistID
        WHERE b.producerID IN (
            SELECT artistID 
            FROM User_Follows_Artist 
            WHERE userName = ?
        )
        ORDER BY b.beatID DESC
        LIMIT 20
    `;

    db.query(query, [userName], (err, results) => {

        if (err) {
            console.error("Error getting new releases:", err);
            return res.status(500).json({ message: "Something went wrong." });
        }

        if (results.length === 0) {
            return res.status(200).json({
                message: "No new releases yet. Follow more artists!",
                releases: []
            });
        }

        return res.status(200).json({ releases: results });
    });

};