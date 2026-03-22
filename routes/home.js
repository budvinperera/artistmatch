const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");

router.get("/feed", feedController.getFeed);
router.post("/feed/like", feedController.likePost);
router.post("/feed/post", feedController.createPost);

module.exports = router;