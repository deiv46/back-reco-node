const UserCar = require('../models/userCarModel'); // Asume que tienes un modelo de relación de usuario con coches

// Controlador para guardar un coche como favorito para un usuario
const addFavoriteCar = async (req, res) => {
  // Lógica para agregar un coche a la lista de favoritos de un usuario

  try {
    const { userId, carId } = req.body;

    // Verifica si el usuario ya tiene el coche en su lista de favoritos
    const existingFavorite = await UserCar.findOne({ userId, carId });

    if (existingFavorite) {
      return res.status(400).json({ error: 'El coche ya está en la lista de favoritos del usuario' });
    }

    // Crea una nueva relación de usuario con coche en la base de datos
    const newUserCar = new UserCar({
      userId,
      carId,
      // Otras propiedades, como fecha de adición, calificaciones, comentarios, etc.
    });

    await newUserCar.save();

    res.json({ message: 'Coche agregado a favoritos con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el coche a favoritos' });
  }
};

// Otros controladores relacionados con relaciones de usuario con coches (eliminar favorito, obtener favoritos, etc.)

module.exports = {
  addFavoriteCar,
  // Otros controladores
};
