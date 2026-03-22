const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArtistFollows = sequelize.define('ArtistFollows', {
  followerArtistId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'followerArtistID'
  },
  followedArtistId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'followedArtistID'
  },
  followDate: {
    type: DataTypes.DATE,
    field: 'followDate'
  }
}, {
  tableName: 'Artist_Follows',
  timestamps: false
});

module.exports = ArtistFollows;
