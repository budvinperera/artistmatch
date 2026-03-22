// controllers/auth.js
const bcrypt = require("bcryptjs");
const db = require("../config/database");

//SIGNUP
exports.signup = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render("signup", { message: "That email is already in use", name, email });
        } else if (password !== passwordConfirm) {
            return res.render("signup", { message: "Passwords do not match", name, email });
        }

        // Hash the password
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // Insert new user into database
        db.query(
            "INSERT INTO users SET ?",
            { name: name, email: email, password: hashedPassword },
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render("signup", { message: "User registered successfully" });
                }
            }
        );
    });
};

//LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("index", { message: "Please provide email and password" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.render("index", { message: "Database error" });
        }

        if (!results || results.length === 0) {
            return res.render("index", { message: "Invalid email or password" });
        }

        const user = results[0];

        if (!user.password) {
            return res.render("index", { message: "Invalid email or password" });
        }

        // Compare password using callback style
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Bcrypt error:", err);
                return res.render("index", { message: "Error during login" });
            }

            if (!isMatch) {
                return res.render("index", { message: "Invalid email or password" });
            }

            // Successful login
            return res.render("home", { name: user.name });
        });
    });
};
