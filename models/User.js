const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING,
  role_id: DataTypes.INTEGER
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
});

// Método de instancia
User.prototype.comparePassword = async function (password) {
  console.log("1) password:", password);
  console.log("2) this.password:", this.password);

  const result = await bcrypt.compare(password, this.password);
  console.log("✅ RESULTADO COMPARADO:", result);

  return result;
};


module.exports = User;
