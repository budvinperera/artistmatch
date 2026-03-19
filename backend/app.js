const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

require("./config/db"); // your MySQL config

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

// Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// Listen on all interfaces
app.listen(5001, "0.0.0.0", () => {
  console.log("Server started on Port 5001");
});