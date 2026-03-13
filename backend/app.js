const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express ();

require("./config/db");

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

//parse URL-encoded bodies(as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set("view engine", "hbs");

//Define Routes

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));


app. listen(5001, () => {
console. log("Server started on Port 5001");
})