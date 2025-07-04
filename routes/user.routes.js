const router = require('express').Router();
const User = require('../models/User');
const Role = require('../models/Role');
const { Property } = require('../models/Property');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const bcrypt = require('bcryptjs');

// ✅ GET - Listar todos los usuarios (solo admin)
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }
    });

    res.json(users);
    
  } catch (err) {
    console.error('❌ Error al listar usuarios:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ GET - Listar solo usuarios con rol de "agent"
router.get('/agents', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const agents = await User.findAll({
      attributes: { exclude: ['password'] },
      where: { role_id: 2 },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }
    });

    res.json(agents);
  } catch (err) {
    console.error('❌ Error al listar agentes:', err);
    res.status(500).json({ message: 'Error al listar agentes' });
  }
});


// ✅ POST - Crear nuevo usuario (solo admin)
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (err) {
    console.error('❌ Error al crear usuario:', err);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// ✅ GET - Obtener usuario por ID
router.get('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ PUT - Actualizar usuario (opcionalmente su contraseña si viene en el body)
router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await User.update(updateData, { where: { id: req.params.id } });
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// ✅ DELETE - Eliminar usuario
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
