const db = require('../config/db');

// Loads the artist search page with suggested artists and new releases
exports.renderArtistSearch = (req, res) => {
    const suggestedQuery = `
        SELECT artistID, artistName, artistStageName, genre
        FROM Artist
        ORDER BY RAND()
            LIMIT 10
    `;
    const newReleasesQuery = `
        SELECT b.beatID, b.beatName, b.genre, b.price, a.artistName
        FROM Beats b
                 JOIN Artist a ON b.producerID = a.artistID
        ORDER BY b.beatID DESC
            LIMIT 10
    `;
    db.query(suggestedQuery, (err, suggestedArtists) => {
        if (err) return res.render("artistSearch", { message: "Error loading page" });
        db.query(newReleasesQuery, (err, newReleases) => {
            if (err) return res.render("artistSearch", { message: "Error loading page" });
            res.render("artistSearch", { suggestedArtists, newReleases });
        });
    });
};

// Handles search when user types a name
exports.searchArtist = (req, res) => {
    const { artistName } = req.query;
    if (!artistName) {
        return res.status(400).json({ message: "Please enter an artist name." });
    }
    const query = `SELECT * FROM Artist WHERE artistName LIKE ?`;
    db.query(query, [`%${artistName}%`], (err, results) => {
        if (err) return res.status(500).json({ message: "Something went wrong." });
        if (results.length === 0) {
            return res.status(200).json({ message: "No artists found.", artists: [] });
        }
        return res.status(200).json({ artists: results });
    });
};

// Gets suggested artists (called separately by route)
exports.getSuggestedArtists = (req, res) => {
    const query = `
        SELECT artistID, artistName, artistStageName, genre
        FROM Artist
        ORDER BY RAND()
        LIMIT 10
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Something went wrong." });
        if (results.length === 0) {
            return res.status(200).json({ message: "No artists found.", suggested: [] });
        }
        return res.status(200).json({ suggested: results });
    });
};

// Gets new releases (called separately by route)
exports.getNewReleases = (req, res) => {
    const query = `
        SELECT b.beatID, b.beatName, b.genre, b.price, a.artistName
        FROM Beats b
        JOIN Artist a ON b.producerID = a.artistID
        ORDER BY b.beatID DESC
        LIMIT 10
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Something went wrong." });
        if (results.length === 0) {
            return res.status(200).json({ message: "No releases found.", releases: [] });
        }
        return res.status(200).json({ releases: results });
    });
};
