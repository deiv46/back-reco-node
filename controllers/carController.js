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
      
      carsData.forEach((brand) => {
        console.log(`Marca: ${brand.nombre}`); // Agregar una traza de la marca
        if (brand.marcas && Array.isArray(brand.marcas)) {
          brand.marcas.forEach((marca) => {
            if (marca.modelos && Array.isArray(marca.modelos)) {
              marca.modelos.forEach((modelo) => {
                if (modelo && modelo._id) {
                  console.log(`Modelo ID: ${modelo._id}`); // Agregar una traza del ID del modelo
                  const modelId = modelo._id;
                  // Verificar si el modelo existe en userFavoriteModels
                  const favoriteModel = userFavoriteModels.find((favoriteModel) => favoriteModel.carId === modelId);
                  if (favoriteModel) {
                    console.log(`El modelo ${modelId} es favorito.`);
                  } else {
                    console.log(`El modelo ${modelId} no es favorito.`);
                  }
                  modelo.isFavorite = !!favoriteModel;
                } else {
                  console.error('Datos de modelo incorrectos:', modelo);
                }
              });
            } else {
              console.error('Datos de modelos incorrectos en la marca:', marca);
            }
          });
        } else {
          console.error('Datos de marcas incorrectos en la marca:', brand);
        }
      });
    }
    
    res.json(carsData);
  } catch (error) {
    console.error('Error al obtener la lista de coches:', error);
    res.status(500).json({ error: 'Error al obtener la lista de coches' });
  } finally {
    // Cierra la conexión a la base de datos de manera segura.
    closeDatabaseConnection();
  }
};

module.exports = {
  getCars,
};
