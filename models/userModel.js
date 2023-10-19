const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String, // ID de usuario (6 posiciones alfanuméricas)
  password: String, // Contraseña del usuario
  // Otros campos relacionados con los usuarios, si es necesario
});

const User = mongoose.model('User', userSchema);

module.exports = User;