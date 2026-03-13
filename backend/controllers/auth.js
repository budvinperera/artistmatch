const bcrypt = require("bcryptjs");
const db = require("../config/db");

// SIGNUP
exports.signup = (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            status: "error",
            message: "All fields required"
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users (name,email,password) VALUES (?,?,?)",
        [name, email, hashedPassword],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.json({
                    status: "error",
                    message: "Database error"
                });
            }

            res.json({
                status: "success",
                message: "User registered successfully"
            });
        }
    );
};


// LOGIN
exports.login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            status: "error",
            message: "Email and password required"
        });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {

        if (err) {
            return res.json({
                status: "error",
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {

            if (!match) {
                return res.json({
                    status: "error",
                    message: "Invalid email or password"
                });
            }

            res.json({
                status: "success",
                message: "Login successful"
            });

        });

    });

};