require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { engine } = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");


const gigsRoutes = require("./routes/gigs.routes");
const messagesRoutes = require("./routes/messages.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse form data

// Handlebars setup
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
  res.send("ArtistMatch API running");
});

// Start server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("sendMessage", (messageData) => {

    io.emit("receiveMessage", messageData);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

