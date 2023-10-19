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
