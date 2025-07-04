const bcrypt = require('bcryptjs');

const plainPassword = '123456';
const hashFromDB = '$2b$10$yAcqwLCYHKQWU6UZf3f78u0n3i6aOqHL5/Zlv2dT4Jmk58n42g2Du';

bcrypt.compare(plainPassword, hashFromDB)
  .then(result => {
    console.log("¿La contraseña coincide?", result);
  })
  .catch(err => {
    console.error("Error al comparar:", err);
  });
