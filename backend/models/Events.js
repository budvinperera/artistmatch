const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Events = sequelize.define('Events', {
  eventId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'eventID'
  },
  eventName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'eventName'
  },
  date: {
    type: DataTypes.DATEONLY,
    field: 'date'
  },
  hostingDetails: {
    type: DataTypes.TEXT,
    field: 'hostingDetails'
  },
  hostUserName: {
    type: DataTypes.STRING(50),
    field: 'hostUserName'
  }
}, {
  tableName: 'Events',
  timestamps: false
});

module.exports = Events;
