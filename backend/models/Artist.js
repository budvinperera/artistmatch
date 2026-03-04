const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Artist = sequelize.define('Artist', {
    artistId: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        field: 'artistID'
    },
    artistName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'artistName'
    },
    artistStageName: {
        type: DataTypes.STRING(100),
        field: 'artistStageName'
    },
    artistRoles: {
        type: DataTypes.STRING(200),
        field: 'artistRoles'
    },
    memberRole: {
        type: DataTypes.STRING(50),
        field: 'memberRole'
    },
    genre: {
        type: DataTypes.STRING(50),
        field: 'genre'
    },
    vocalistType: {
        type: DataTypes.STRING(50),
        field: 'vocalistType'
    },
    songwriterType: {
        type: DataTypes.STRING(50),
        field: 'songwriterType'
    },
    instrumentType: {
        type: DataTypes.STRING(50),
        field: 'instrumentType'
    },
    percussionInstrument: {
        type: DataTypes.STRING(50),
        field: 'percussionInstrument'
    },
    stageName: {
        type: DataTypes.STRING(100),
        field: 'stageName'
    },
    experienceYears: {
        type: DataTypes.INTEGER,
        field: 'experienceYears'
    }
}, {
    tableName: 'Artist',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = Artist;