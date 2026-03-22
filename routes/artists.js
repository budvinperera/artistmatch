const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController.js");
const { filterArtists } = require("../controllers/searchFilters");

// Search by name
router.get("/search", artistController.searchArtist);

// Suggested artists
router.get("/suggested-artists", artistController.getSuggestedArtists);

// New releases
router.get("/new-releases", artistController.getNewReleases);

// Search filter
router.get("/search/filter", filterArtists);

module.exports = router;