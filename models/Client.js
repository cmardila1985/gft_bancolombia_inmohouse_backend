const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Client = sequelize.define('Client', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  agentId: {
    type: DataTypes.INTEGER,
    field: 'agent_id', // 👈 IMPORTANTE: si en la DB se llama `agent_id`
    allowNull: true
  }
}, {
  tableName: 'clients', // 👈 Asegura coincidencia exacta con la tabla
  timestamps: true
});

module.exports = Client;
