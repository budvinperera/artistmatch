const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Beats = sequelize.define('Beats', {
  beatId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'beatID'
  },
  beatName: {
    type: DataTypes.STRING(100),
    field: 'beatName'
  },
  price: {
    type: DataTypes.DOUBLE,
    field: 'price'
  },
  beatDetails: {
    type: DataTypes.TEXT,
    field: 'beatDetails'
  },
  producerId: {
    type: DataTypes.STRING(50),
    field: 'producerID'
  },
  genre: {
    type: DataTypes.STRING(50),
    field: 'genre'
  }
}, {
  tableName: 'Beats',
  timestamps: false
});

module.exports = Beats;
