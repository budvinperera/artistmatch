const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BeatPurchase = sequelize.define('BeatPurchase', {
  purchaseId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'purchaseID'
  },
  beatId: {
    type: DataTypes.STRING(50),
    field: 'beatID'
  },
  buyerArtistId: {
    type: DataTypes.STRING(50),
    field: 'buyerArtistID'
  },
  purchaseDate: {
    type: DataTypes.DATE,
    field: 'purchaseDate'
  },
  purchasePrice: {
    type: DataTypes.FLOAT,
    field: 'purchasePrice'
  }
}, {
  tableName: 'Beat_Purchase',
  timestamps: false
});

module.exports = BeatPurchase;
