// controllers/authController.js

const db = require("../config/db");
const admin = require("../config/firebase");

// Signup route
exports.signup = async (req, res) => {
  const { name, email, password, genres } = req.body;

  // 1️⃣ Validate input
  if (
    !name ||
    !email ||
    !password ||
    !Array.isArray(genres) ||
    genres.length === 0
  ) {
    return res.status(400).json({
      error:
        "All fields are required, and at least one genre must be selected",
    });
  }

  try {
    // 2️⃣ Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const firebaseUid = userRecord.uid;

    // 3️⃣ Insert user into MySQL
    db.query(
      "INSERT INTO users (name, email, firebase_uid) VALUES (?, ?, ?)",
      [name, email, firebaseUid],
      (err, result) => {
        if (err) {
          console.error("MySQL insert error:", err);
          return res
            .status(500)
            .json({ error: "Database error: " + err.message });
        }

        const userId = result.insertId;

        // 4️⃣ Insert genres into user_genres
        const genreValues = genres.map((genreId) => [
          userId,
          genreId,
        ]);

        db.query(
          "INSERT INTO user_genres (user_id, genre_id) VALUES ?",
          [genreValues],
          (err2) => {
            if (err2) {
              console.error("MySQL genre insert error:", err2);
              return res
                .status(500)
                .json({ error: "Database error: " + err2.message });
            }

            return res.status(201).json({
              message: "User registered successfully",
              userId,
              firebaseUid,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Firebase error:", error);

    // Firebase error codes are more descriptive
    const firebaseError =
      error.code || error.message || "Unknown Firebase error";

    return res.status(500).json({ error: firebaseError });
  }
};

// Login route
exports.login = async (req, res) => {
  res.status(200).json({ message: "Login route working" });
};