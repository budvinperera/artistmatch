const express = require("express");
const router = express.Router();
const db = require("../db");

// SEND MESSAGE
router.post("/", (req, res) => {
  const { sender_id, receiver_id, message, file_url } = req.body;

  if (!sender_id || !receiver_id) {
    return res.status(400).json({
      message: "sender_id and receiver_id required",
    });
  }

  const sql = `
    INSERT INTO messages 
    (sender_id, receiver_id, message, file_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [sender_id, receiver_id, message || null, file_url || null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Message sent",
        message_id: result.insertId,
      });
    },
  );
});

// GET CHAT BETWEEN 2 USERS
router.get("/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  const sql = `
    SELECT *
    FROM messages
    WHERE 
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  db.query(sql, [user1, user2, user2, user1], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

module.exports = router;

// Export for use in Socket.IO
const saveMessage = (senderId, receiverId, message, fileUrl = null) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO messages (sender_id, receiver_id, message, file_url)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [senderId, receiverId, message || null, fileUrl], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

module.exports = { router, saveMessage };