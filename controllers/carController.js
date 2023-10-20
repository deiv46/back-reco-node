const { connectToDatabase } = require('../database/database');

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Obtener una lista de coches.
 *     tags: [Coches]
 *     description: Obtiene una lista de coches disponibles en la API.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa con la lista de coches.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       '500':
 *         description: Error interno del servidor.
 */

const getCars = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const carsData = await db.collection('cars').find().toArray();
    const userName = req.query.userName;
    
    if (userName) {
      // Si se proporciona el nombre de usuario, busca los modelos de coches marcados como favoritos por ese usuario
      const userFavoriteModels = await db.collection('userCars').find({ userName }).toArray();
      
      // Recorre la estructura de datos de los coches y agrega una propiedad "isFavorite" a los modelos
      carsData.forEach((brand) => {
        brand.modelos.forEach((modelo) => {
          const modelId = modelo._id;
          modelo.isFavorite = userFavoriteModels.some((favoriteModel) => favoriteModel.carId === modelId);
        });
      });
    }
    
    res.json(carsData);
  } catch (error) {
    console.error('Error al obtener la lista de coches:', error);
    res.status(500).json({ error: 'Error al obtener la lista de coches' });
  }
};


module.exports = {
  getCars,
  // Otros controladores
};
