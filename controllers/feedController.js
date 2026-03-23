// feedController.js
// Handles the home feed page
// Shows posts from artists the user follows + suggested artists they don't follow yet

const Posts = require('../models/Posts');
const Artist = require('../models/Artist');
const Likes = require('../models/Likes');
const UserFollowsArtist = require('../models/UserFollowsArtist');
const { Op } = require('sequelize');


exports.getFeed = async (req, res) => {
    const { userName } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "Please provide a userName." });
    }

    try {
        // Step 1: Find all artists this user follows
        const followRecords = await UserFollowsArtist.findAll({
            where: { userName: userName }
        });
        const followedArtistIds = followRecords.map(f => f.artistId);

        // Step 2: Get posts from artists they follow (newest first)
        let followedPosts = [];
        if (followedArtistIds.length > 0) {
            followedPosts = await Posts.findAll({
                where: { artistId: { [Op.in]: followedArtistIds } },
                order: [['datetime', 'DESC']],
                limit: 20
            });
        }

        // Step 3: Get suggested posts from artists they don't follow yet
        const suggestedPosts = await Posts.findAll({
            where: {
                artistId: {
                    [Op.notIn]: followedArtistIds.length > 0 ? followedArtistIds : ['']
                }
            },
            order: [['datetime', 'DESC']],
            limit: 10
        });

        // Step 4: Combine all posts
        const allPosts = [...followedPosts, ...suggestedPosts];

        if (allPosts.length === 0) {
            return res.status(200).json({
                message: "No posts yet. Follow some artists!",
                feed: []
            });
        }

        // Step 5: Get artist info for all posts in one query (efficient)
        const artistIds = [...new Set(allPosts.map(p => p.artistId))];
        const artists = await Artist.findAll({
            where: { artistId: { [Op.in]: artistIds } }
        });

        // Step 6: Build the final feed response
        // For each post attach: artist name, stage name, like count, did this user like it
        const feed = await Promise.all(allPosts.map(async (post) => {
            const artist = artists.find(a => a.artistId === post.artistId);

            // How many people liked this post
            const likeCount = await Likes.count({ where: { postId: post.postId } });

            // Did this specific user like it already
            const userLiked = await Likes.findOne({
                where: { userName: userName, postId: post.postId }
            });

            return {
                postId: post.postId,
                postContent: post.postContent,   // this is the caption
                postType: post.postType,
                datetime: post.datetime,
                artistId: post.artistId,
                fileUrl: post.fileUrl || null,
                artistName: artist ? artist.artistName : "Unknown Artist",
                artistStageName: artist ? artist.artistStageName : "",
                likeCount: likeCount,
                likedByMe: !!userLiked,                                    // true or false
                isFollowed: followedArtistIds.includes(post.artistId)      // so Flutter knows follow/unfollow
            };
        }));

        return res.status(200).json({ feed });

    } catch (error) {
        console.error("Error getting feed:", error);
        return res.status(500).json({ message: "Something went wrong getting the feed." });
    }
};

// ─────────────────────────────────────────────────────
// POST /feed/like
// Like or unlike a post (toggles)
// Body: { userName, postId }
// ─────────────────────────────────────────────────────
exports.likePost = async (req, res) => {
    const { userName, postId } = req.body;

    if (!userName || !postId) {
        return res.status(400).json({ message: "Please provide userName and postId." });
    }

    try {
        // Check if this user already liked this post
        const existing = await Likes.findOne({ where: { userName, postId } });

        if (existing) {
            // Already liked — remove the like (unlike)
            await existing.destroy();
            return res.status(200).json({ message: "Post unliked.", action: "unliked" });
        } else {
            // Not liked yet — add the like
            await Likes.create({ userName, postId, likedAt: new Date() });
            return res.status(201).json({ message: "Post liked!", action: "liked" });
        }

    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ message: "Something went wrong liking the post." });
    }
};

// ─────────────────────────────────────────────────────
// POST /feed/post
// Create a new post (artist posting to their feed)
// Body: { artistId, postContent, postType }
// ─────────────────────────────────────────────────────
exports.createPost = async (req, res) => {
    const { artistId, postContent, postType } = req.body;

    if (!artistId || !postContent) {
        return res.status(400).json({ message: "Please provide artistId and postContent." });
    }

    try {
        const newPost = await Posts.create({
            postId: 'post_' + Date.now(),       // simple unique ID
            artistId: artistId,
            postContent: postContent,
            postType: postType || 'general',    // default type if not given
            datetime: new Date()
        });

        return res.status(201).json({ message: "Post created!", post: newPost });

    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Something went wrong creating the post." });
    }
};