const { sequelize } = require('../config/db');

const Role = require('./Role');
const User = require('./User');
const Property = require('./Property');
const Client = require('./Client');

// Relaciones entre Usuario y Rol
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

// Relaciones entre Usuario (agente) y Cliente
Client.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });
User.hasMany(Client, { foreignKey: 'agentId', as: 'clients' });

// Relaciones entre Usuario (agente) y Propiedad
Property.belongsTo(User, { foreignKey: 'agent_id', as: 'agentUser' }); // 👈 cambio aquí
 



module.exports = {
  sequelize,
  User,
  Role,
  Property,
  Client
};
