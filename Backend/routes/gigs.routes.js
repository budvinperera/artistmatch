const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your database connection

// POST a new gig
router.post("/", (req, res) => {
  const { eventTitle, venue, date, time, genre, pay } = req.body;

  if (!eventTitle || !venue || !date || !time || !genre || !pay) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO gigs 
    (event_title, venue, event_date, event_time, genre, pay)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [eventTitle, venue, date, time, genre, pay], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res
      .status(201)
      .json({ message: "Gig posted successfully", gigId: result.insertId });
  });
});

// GET all gigs
router.get("/", (req, res) => {
  const sql = "SELECT * FROM gigs ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

module.exports = router;
