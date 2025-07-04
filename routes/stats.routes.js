const router = require('express').Router();
const Property = require('../models/Property'); // ✅ FIX
const User = require('../models/User');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const { sequelize } = require('../models');

// 📊 Propiedades por tipo
router.get('/properties-by-type', authenticate, authorizeRoles('admin', 'agent'), async (req, res) => {
  try {
    const result = await Property.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    res.json(result);
  } catch (err) {
    console.error('❌ Error al obtener propiedades por tipo:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 📊 Propiedades por agente
router.get('/properties-by-agent', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await Property.findAll({
      include: [{
        model: User,
        as: 'agentUser',
        attributes: ['name']
      }],
      attributes: [
        'agentId',
        [sequelize.fn('COUNT', sequelize.col('Property.id')), 'count']
      ],
      group: ['agentUser.name', 'agentId']
    });

    const formatted = result.map((item) => ({
      agent: item.agentUser?.name || 'Sin asignar',
      count: parseInt(item.dataValues.count)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error al obtener propiedades por agente:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
