// config/firebase.js
const admin = require("firebase-admin");
const path = require("path");

// Load your service account JSON directly
const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json")); // adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase initialized for project:", serviceAccount.project_id);

module.exports = admin;