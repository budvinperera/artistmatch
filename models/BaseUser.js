const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaseUser = sequelize.define('BaseUser', {
  userName: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    field: 'userName'
  },
  userAge: {
    type: DataTypes.INTEGER,
    field: 'userAge'
  },
  memberRole: {
    type: DataTypes.STRING(50),
    field: 'memberRole'
  }
}, {
  tableName: 'Base_User',
  timestamps: false
});

module.exports = BaseUser;
