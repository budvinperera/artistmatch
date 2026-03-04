const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventArtist = sequelize.define('EventArtist', {
  eventId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'eventID'
  },
  artistId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'artistID'
  }
}, {
  tableName: 'Event_Artist',
  timestamps: false
});

module.exports = EventArtist;
