const mongoose = require('mongoose');

const userCarSchema = new mongoose.Schema({
  userId: String, // ID del usuario que seleccionó el coche como favorito
  carId: String, // ID del coche favorito (puede ser el ID generado para "cars")
  // Otros campos relacionados con la relación entre usuarios y coches favoritos, si es necesario
});

const UserCar = mongoose.model('UserCar', userCarSchema);

module.exports = UserCar;