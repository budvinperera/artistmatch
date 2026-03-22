const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require('cors');        // ← 1. require cors

dotenv.config();                     // ← 2. load .env

const app = express();               // ← 3. create app

app.use(cors());                     // ← 4. now use cors

require("./config/database");

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

// Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/artists"));
app.use("/", require("./routes/home"));
app.use("/", require("./routes/follow"));
app.use("/", require("./routes/upload"));

app.listen(5001, () => {
    console.log("Server started on Port 5001");
});