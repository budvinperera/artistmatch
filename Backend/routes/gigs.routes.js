const express = require("express");
const router = express.Router();
const db = require("../db"); // your database connection

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

db.query(sql, [eventTitle, venue, date, time, genre, Number(pay)], (err, result) => {
  if (err) {
    console.error("DB error on POST /api/gigs:", err);
    return res.status(500).json({ message: "Database error" });
  }

  const acceptsJson = req.headers["content-type"]?.includes("application/json");
  if (acceptsJson) {
    return res.status(201).json({ message: "Gig posted successfully", gigId: result.insertId });
  }
  res.redirect("/");
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

router.get("/:id", (req, res) => {
  db.query("SELECT * FROM gigs WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Gig not found" });
    res.json(results[0]);
  });
});

module.exports = router;

