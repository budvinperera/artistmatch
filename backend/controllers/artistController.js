// config/db.js
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


// GET /search?artistName=...
exports.searchArtist = (req, res) => {
    const { artistName } = req.query;

    if (!artistName) {
        return res.render("home", { message: "Please enter an artist name." });
    }

    const query = "SELECT * FROM artists WHERE name LIKE ?";
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
