const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  memberId: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    field: 'memberID'
  },
  memberRole: {
    type: DataTypes.STRING(50),
    field: 'memberRole'
  },
  memberName: {
    type: DataTypes.STRING(50),
    field: 'memberName'
  },
  memberAge: {
    type: DataTypes.INTEGER,
    field: 'memberAge'
  },
  memberAccountDetails: {
    type: DataTypes.STRING(255),
    field: 'memberAccountDetails'
  }
}, {
  tableName: 'Member',
  timestamps: false
});

module.exports = Member;
