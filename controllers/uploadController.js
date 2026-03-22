// uploadController.js
// Handles file uploads (images, audio, video) to Supabase Storage
// Then saves the post to the database

const { createClient } = require('@supabase/supabase-js');
const Posts = require('../models/Posts');
const multer = require('multer');

// Supabase setup
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Multer setup — stores file in memory so we can send it to Supabase
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

// Export the multer middleware so the route can use it
exports.uploadMiddleware = upload.single('file'); // 'file' is the field name Flutter sends

// ─────────────────────────────────────────────────────
// POST /upload
// Upload a file and create a post
// Body: multipart/form-data with fields:
//   - file: the actual file
//   - artistId: who is posting
//   - caption: post caption
//   - postType: 'image', 'audio', or 'video'
// ─────────────────────────────────────────────────────
exports.uploadPost = async (req, res) => {
    try {
        const { artistId, caption, postType } = req.body;

        if (!artistId || !req.file) {
            return res.status(400).json({ message: 'Please provide artistId and a file.' });
        }

        // Step 1: Upload file to Supabase Storage
        const file = req.file;
        const fileName = `${artistId}_${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
        const filePath = `${postType || 'image'}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('posts')  // this is your bucket name
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ message: 'File upload failed.', error: error.message });
        }

        // Step 2: Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);

        const fileUrl = urlData.publicUrl;

        // Step 3: Save the post to the database
        const newPost = await Posts.create({
            postId: 'post_' + Date.now(),
            artistId: artistId,
            postContent: caption || '',
            postType: postType || 'image',
            fileUrl: fileUrl,       // the URL of the uploaded file
            datetime: new Date()
        });

        return res.status(201).json({
            message: 'Post uploaded successfully!',
            post: newPost,
            fileUrl: fileUrl
        });

    } catch (error) {
        console.error('Error uploading post:', error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
};