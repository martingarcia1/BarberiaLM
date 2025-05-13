const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const hashedPassword = '$2a$10$R6rfQKZiFYA36sGc7TNBPe3ftlJlqx7bKEXTO898jbUsg6JGHPnxW'; // Reemplaza con el hash de la base de datos
  const plainPassword = 'LoreAdmin2398'; // Reemplaza con la contraseña que estás ingresando

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('¿La contraseña coincide?', isMatch);
};

testPassword();