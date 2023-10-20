const UserCar = require('../models/userCarModel');
const { connectToDatabase } = require('../database/database');

const addFavoriteCar = async (req, res) => {
  try {
    const { userName, carId } = req.body;
    const db = await connectToDatabase();
    
    const existingFavorite = await db.collection('userCars').findOne({ userName, carId });
    
    if (existingFavorite) {
      // Si el coche ya está en favoritos, lo eliminamos
      await db.collection('userCars').deleteOne({ userName, carId });
      res.status(200).json({ message: 'Coche eliminado de favoritos con éxito' });
    } else {
      // Si el coche no está en favoritos, lo agregamos
      await db.collection('userCars').insertOne({
        userName,
        carId,
      });
    
      res.status(200).json({ message: 'Coche agregado a favoritos con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al gestionar el coche en favoritos' });
  }
};

module.exports = {
  addFavoriteCar,
};
