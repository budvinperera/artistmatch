require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { engine } = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");

const gigsRoutes = require("./routes/gigs.routes");
const { router: messagesRoutes, saveMessage } = require("./routes/messages.routes"); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse form data

// Handlebars setupd
app.engine("hbs", engine({ extname: "hbs", defaultLayout: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// HBS page route
app.get("/post-gig", (req, res) => {
  res.render("postGig", { title: "Post a Gig" });
});

// API routes
app.use("/api/gigs", gigsRoutes);
app.use("/api/messages", messagesRoutes);

// Chat UI route
app.get("/chat", (req, res) => {
  res.render("chat", { title: "Chat UI" });
});

// Root route
app.get("/", (req, res) => {
  res.send("hello");
});

// Start server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
  
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins their own room
  socket.on("joinRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on("sendMessage", async (messageData) => {
  try {
    await saveMessage(messageData.senderId, messageData.receiverId, messageData.message);
    
    // Send only to recipient's room
    io.to(`user_${messageData.receiverId}`).emit("receiveMessage", {
  senderId: messageData.senderId,
  receiverId: messageData.receiverId,
  message: messageData.message,
  timestamp: new Date().toISOString(),
});

io.to(`user_${messageData.senderId}`).emit("conversationUpdated", {
  senderId: messageData.senderId,
  receiverId: messageData.receiverId,
  message: messageData.message,
  timestamp: new Date().toISOString(),
});
  } catch (err) {
    console.error("Failed to save/emit message:", err);
  }
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
