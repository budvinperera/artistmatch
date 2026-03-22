const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAttendsEvent = sequelize.define('UserAttendsEvent', {
  userName: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'userName'
  },
  eventId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'eventID'
  },
  registrationDate: {
    type: DataTypes.DATE,
    field: 'registrationDate'
  }
}, {
  tableName: 'User_Attends_Event',
  timestamps: false
});

module.exports = UserAttendsEvent;
