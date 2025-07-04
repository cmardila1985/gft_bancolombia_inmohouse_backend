
const router = require('express').Router();
const Client = require('../models/Client');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/', authenticate, authorizeRoles('agent'), async (req, res) => {
  try {
    const clients = await Client.findAll({ where: { agentId: req.user.id } });
    res.json(clients);
  } catch (err) {
    console.error('❌ Error al consultar clientes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/', authenticate, authorizeRoles('agent'), async (req, res) => {
  const client = await Client.create({ ...req.body, agentId: req.user.id });
  res.json(client);
});

router.delete('/:id', authenticate, authorizeRoles('agent'), async (req, res) => {
  await Client.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

router.put('/:id', authenticate, authorizeRoles('agent'), async (req, res) => {
  try {
    const [updatedRows] = await Client.update(req.body, {
      where: {
        id: req.params.id,
        agentId: req.user.id, // Asegura que solo actualizas clientes del agente autenticado
      },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado o sin permisos' });
    }

    const updatedClient = await Client.findByPk(req.params.id);
    res.json(updatedClient);
  } catch (err) {
    console.error('❌ Error al actualizar cliente:', err);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
});

module.exports = router;
