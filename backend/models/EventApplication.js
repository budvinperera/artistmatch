const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventApplication = sequelize.define('EventApplication', {
  applicationId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'applicationID'
  },
  eventId: {
    type: DataTypes.STRING(50),
    field: 'eventID'
  },
  artistId: {
    type: DataTypes.STRING(50),
    field: 'artistID'
  },
  applicationStatus: {
    type: DataTypes.STRING(50),
    defaultValue: 'Pending',
    field: 'applicationStatus'
  },
  applicationDate: {
    type: DataTypes.DATE,
    field: 'applicationDate'
  }
}, {
  tableName: 'Event_Application',
  timestamps: false
});

module.exports = EventApplication;
