const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Asegúrate que Role esté bien exportado
const dotenv = require('dotenv');
dotenv.config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    console.log(" AQUI QUE LLEGO VE ", user.role?.name)
    // ✅ Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role?.name || 'unknown'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.name || 'unknown'
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
