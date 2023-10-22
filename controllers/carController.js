const { connectToDatabase, closeDatabaseConnection } = require('../database/database');

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
      const userFavoriteModels = await db.collection('userCars').find({ userName }).toArray();
      
      carsData.forEach((brand) => {
        if (brand.marcas && Array.isArray(brand.marcas)) {
          brand.marcas.forEach((marca) => {
            if (marca.modelos && Array.isArray(marca.modelos)) {
              marca.modelos.forEach((modelo) => {
                if (modelo && modelo._id) {
                  const modelId = modelo._id;
                  const favoriteModel = userFavoriteModels.find((favoriteModel) => favoriteModel.carId === modelId);
                  modelo.isFavorite = !!favoriteModel;
                }
              });
            }
          });
        }
      });
    }
    
    res.json(carsData);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de coches' });
  } finally {
    closeDatabaseConnection();
  }
};

module.exports = {
  getCars,
};