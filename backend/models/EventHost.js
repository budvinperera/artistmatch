const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventHost = sequelize.define('EventHost', {
  userName: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'userName'
  },
  hostCompany: {
    type: DataTypes.STRING(100),
    field: 'hostCompany'
  },
  hosterType: {
    type: DataTypes.STRING(50),
    field: 'hosterType'
  }
}, {
  tableName: 'Event_Host',
  timestamps: false
});

module.exports = EventHost;
