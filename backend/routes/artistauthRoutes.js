const express = require("express");
const router = express.Router();
const artistAuthController = require("../controllers/artistauthController");

router.post("/artists/signup", artistAuthController.artistSignup);
router.post("/artists/verify-otp", artistAuthController.verifyArtistOTP);
router.post("/artists/resend-otp", artistAuthController.resendArtistOTP);
router.post("/artists/login", artistAuthController.artistLogin);

module.exports = router;