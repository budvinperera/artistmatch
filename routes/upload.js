const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

// POST /upload — upload a file and create a post
router.post("/upload", uploadController.uploadMiddleware, uploadController.uploadPost);

module.exports = router;