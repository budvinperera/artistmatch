const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prod = sequelize.define('Prod', {
  prodId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'prodID'
  },
  artistId: {
    type: DataTypes.STRING(50),
    field: 'artistID'
  },
  stageName: {
    type: DataTypes.STRING(100),
    field: 'stageName'
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    field: 'experienceYears'
  },
  genre: {
    type: DataTypes.STRING(50),
    field: 'genre'
  }
}, {
  tableName: 'Prod',
  timestamps: false
});

module.exports = Prod;
