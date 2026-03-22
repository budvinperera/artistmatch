const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feed = sequelize.define('Feed', {
  feedId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'feedID'
  },
  userName: {
    type: DataTypes.STRING(50),
    field: 'userName'
  },
  feedTimeStamp: {
    type: DataTypes.DATE,
    field: 'feedTimeStamp'
  }
}, {
  tableName: 'Feed',
  timestamps: false
});

module.exports = Feed;
