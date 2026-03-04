const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeedPosts = sequelize.define('FeedPosts', {
  feedId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'feedID'
  },
  postId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'postID'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    field: 'displayOrder'
  }
}, {
  tableName: 'Feed_Posts',
  timestamps: false
});

module.exports = FeedPosts;
