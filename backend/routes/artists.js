// routes/artist.js
const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController.js");

// Search route
router.get("/search", artistController.searchArtist);

module.exports = router;
