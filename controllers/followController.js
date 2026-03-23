// followController.js
// Handles following and unfollowing artists
// Used in: feed, artist profile, search results — anywhere a follow button appears

const UserFollowsArtist = require('../models/UserFollowsArtist');

// ─────────────────────────────────────────────────────
// POST /follow
// Follow or unfollow an artist (toggles)
// Body: { userName, artistId }
// ─────────────────────────────────────────────────────
exports.followArtist = async (req, res) => {
    const { userName, artistId } = req.body;

    if (!userName || !artistId) {
        return res.status(400).json({ message: "Please provide userName and artistId." });
    }

    try {
        // Check if already following
        const existing = await UserFollowsArtist.findOne({
            where: { userName, artistId }
        });

        if (existing) {
            // Already following — unfollow
            await existing.destroy();
            return res.status(200).json({ message: "Unfollowed.", action: "unfollowed" });
        } else {
            // Not following — follow
            await UserFollowsArtist.create({
                userName,
                artistId,
                followDate: new Date()
            });
            return res.status(201).json({ message: "Following!", action: "followed" });
        }

    } catch (error) {
        console.error("Error following artist:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};