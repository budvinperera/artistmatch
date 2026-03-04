const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserFollowsArtist = sequelize.define('UserFollowsArtist', {
  userName: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'userName'
  },
  artistId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'artistID'
  },
  followDate: {
    type: DataTypes.DATE,
    field: 'followDate'
  }
}, {
  tableName: 'User_Follows_Artist',
  timestamps: false
});

module.exports = UserFollowsArtist;
