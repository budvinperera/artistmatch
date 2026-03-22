// syncAll.js
// Runs all models at once to create all tables
// In terminal: node syncAll.js

const sequelize = require('./config/database');

// Import all your models
require('./models/Artist');
require('./models/Artistfollows');
require('./models/ArtistSearch');
require('./models/BaseUser');
require('./models/BeatPurchase');
require('./models/Beats');
require('./models/EventApplication');
require('./models/EventArtist');
require('./models/EventHost');
require('./models/Events');
require('./models/Feed');
require('./models/FeedPosts');
require('./models/Member');
require('./models/Posts');
require('./models/Prod');
require('./models/UserAttendsEvent');
require('./models/UserFollowsArtist');

// Create all tables at once
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ All tables created successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Error creating tables:', err.message);
        process.exit(1);
    });
