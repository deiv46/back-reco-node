const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  img: String,
  // Otros campos relacionados con los coches, si es necesario
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
