require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { engine } = require("express-handlebars");

const gigsRoutes = require("./routes/gigs.routes");

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

// Root route
app.get("/", (req, res) => {
  res.send("ArtistMatch API running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
