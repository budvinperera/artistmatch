const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArtistSearch = sequelize.define('ArtistSearch', {
  searchId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'searchID'
  },
  memberRole: {
    type: DataTypes.STRING(50),
    field: 'memberRole'
  },
  memberId: {
    type: DataTypes.STRING(50),
    field: 'memberID'
  },
  type: {
    type: DataTypes.STRING(50),
    field: 'type'
  }
}, {
  tableName: 'ArtistSearch',
  timestamps: false
});

module.exports = ArtistSearch;
