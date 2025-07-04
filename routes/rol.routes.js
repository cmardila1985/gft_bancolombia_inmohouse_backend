const router = require('express').Router();
const Role = require('../models/Role');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Obtener todos los roles
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    console.error('❌ Error al obtener roles:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear un nuevo rol
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.json(role);
  } catch (err) {
    console.error('❌ Error al crear rol:', err);
    res.status(500).json({ message: 'Error al crear rol' });
  }
});

// Actualizar un rol por ID
router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const updated = await Role.update(req.body, {
      where: { id: req.params.id }
    });
    res.json(updated);
  } catch (err) {
    console.error('❌ Error al actualizar rol:', err);
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
});

// Eliminar un rol por ID
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    await Role.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Rol eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar rol:', err);
    res.status(500).json({ message: 'Error al eliminar rol' });
  }
});

module.exports = router;
