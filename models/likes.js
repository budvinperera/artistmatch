const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tracks who liked which post
// Each user can only like a post once (userName + postId together = primary key)
const Likes = sequelize.define('Likes', {
    userName: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        field: 'userName'
    },
    postId: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        field: 'postID'
    },
    likedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'likedAt'
    }
}, {
    tableName: 'Likes',
    timestamps: false
});

module.exports = Likes;