const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Posts = sequelize.define('Posts', {
  postId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'postID'
  },
  artistId: {
    type: DataTypes.STRING(50),
    field: 'artistID'
  },
  datetime: {
    type: DataTypes.DATE,
    field: 'datetime'
  },
  postType: {
    type: DataTypes.STRING(50),
    field: 'postType'
  },
  postContent: {
    type: DataTypes.TEXT,
    field: 'postContent'
  }
}, {
  tableName: 'Posts',
  timestamps: false
});

module.exports = Posts;
