const express = require("express");
const router = express.Router();
const db = require("../db");
 
// SEND MESSAGE
router.post("/", (req, res) => {
  const { sender_id, receiver_id, message, file_url } = req.body;
 
  if (!sender_id || !receiver_id) {
    return res.status(400).json({ message: "sender_id and receiver_id required" });
  }
 
  const sql = `
    INSERT INTO messages (sender_id, receiver_id, message, file_url)
    VALUES (?, ?, ?, ?)
  `;
 
  db.query(sql, [sender_id, receiver_id, message || null, file_url || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
 
    // 🔥 GET SOCKET.IO INSTANCE
    const io = req.app.get("io");
 
    const messageData = {
      senderId: sender_id,
      receiverId: receiver_id,
      message: message,
      timestamp: new Date().toISOString(),
    };
 
    // 🔥 EMIT EVENTS (THIS IS THE FIX)
    io.to(`user_${receiver_id}`).emit("receiveMessage", messageData);
    io.to(`user_${sender_id}`).emit("conversationUpdated", messageData);
 
    res.json({
      message: "Message sent",
      message_id: result.insertId,
    });
  });
});
 
// ✅ GET ALL CONVERSATIONS FOR A USER
router.get("/conversations/:userId", (req, res) => {
  const { userId } = req.params;
 
  const sql = `
    SELECT 
      CASE 
        WHEN sender_id = ? THEN receiver_id 
        ELSE sender_id 
      END AS other_user_id,
      message,
      created_at,
      SUM(CASE WHEN receiver_id = ? AND is_read = FALSE THEN 1 ELSE 0 END) 
        OVER (PARTITION BY 
          CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
        ) AS unread_count
    FROM messages
    WHERE sender_id = ? OR receiver_id = ?
    ORDER BY created_at DESC
  `;
 
  db.query(sql, [userId, userId, userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
 
    // deduplicate — keep only latest message per other user
    const seen = new Set();
    const conversations = results
      .filter((row) => {
        if (seen.has(row.other_user_id)) return false;
        seen.add(row.other_user_id);
        return true;
      })
      .map((row) => ({
        other_user_id: row.other_user_id,
        other_user_name: `User ${row.other_user_id}`,
        message: row.message,
        unread_count: row.unread_count || 0,
      }));
 
    res.json(conversations);
  });
});
 
// GET CHAT BETWEEN 2 USERS
router.get("/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;
 
  const sql = `
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
    OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;
 
  db.query(sql, [user1, user2, user2, user1], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});
 
// MARK MESSAGES AS READ
router.put("/read/:senderId/:receiverId", (req, res) => {
  const { senderId, receiverId } = req.params;
 
  const sql = `UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE`;
 
  db.query(sql, [senderId, receiverId], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Messages marked as read" });
  });
});
 
// Export saveMessage for Socket.IO
const saveMessage = (senderId, receiverId, message, fileUrl = null) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO messages (sender_id, receiver_id, message, file_url) VALUES (?, ?, ?, ?)`;
    db.query(sql, [senderId, receiverId, message || null, fileUrl], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};
 
module.exports = { router, saveMessage };