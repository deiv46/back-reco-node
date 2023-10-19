const { connectToDatabase } = require('../database/database');

// Controlador para obtener una lista de coches
const getCars = async (req, res) => {
  try {
    const db = await connectToDatabase(); // Obtén la conexión a la base de datos
    const cars = await db.collection('cars').find().toArray(); // Realiza una consulta a la colección 'cars'
    res.json(cars);
  } catch (error) {
    console.error('Error al obtener la lista de coches:', error);
    res.status(500).json({ error: 'Error al obtener la lista de coches' });
  }
};

module.exports = {
  getCars,
  // Otros controladores
};
