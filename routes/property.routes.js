
const router = require('express').Router();
const Property = require('../models/Property');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/', authenticate, async (req, res) => { 
  try {
    let properties;

    if (req.user.role === 'admin') {
      properties = await Property.findAll(
        {
          include: {
            model: User,
            as: 'agentUser',
            attributes: ['id', 'name', 'email']
          }
        }
      );
    } else if (req.user.role === 'agent') {

      properties = await Property.findAll(
        {
          include: {
            model: User,
            as: 'agentUser',
            attributes: ['id', 'name', 'email']
          }
        }
      );
      /*properties = await Property.findAll({
        where: { agentId: req.user.id }
      });*/
    } else {
      return res.status(403).json({ message: 'Rol no autorizado para consultar propiedades' });
    }

    res.json(properties);
  } catch (err) {
    console.error('❌ Error al obtener propiedades:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.json(property);
  } catch (err) {
    console.error('❌ Error al crear propiedad:', err);
    res.status(500).json({ message: 'Error al crear propiedad' });
  }
});

router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  const updated = await Property.update(req.body, { where: { id: req.params.id } });
  res.json(updated);
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  await Property.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;
