
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Property = sequelize.define('Property', {
  title: DataTypes.STRING,
  type: DataTypes.STRING,
  location: DataTypes.STRING,
  price: DataTypes.FLOAT,
  agentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'agent_id'
  }
});

module.exports = Property;
