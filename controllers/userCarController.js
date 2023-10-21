const UserCar = require('../models/userCarModel');
const { connectToDatabase, closeDatabaseConnection } = require('../database/database');

/**
 * @swagger
 * /addFavoriteCar:
 *   post:
 *     summary: Añadir o eliminar un coche de favoritos para un usuario.
 *     description: Añade un coche a la lista de favoritos de un usuario o lo elimina si ya está en la lista.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: El nombre de usuario.
 *               carId:
 *                 type: string
 *                 description: El ID del coche.
 *     responses:
 *       200:
 *         description: Coche agregado o eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

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
  } finally {
    // Cierra la conexión a la base de datos de manera segura.
    closeDatabaseConnection();
  }
};

/**
 * @swagger
 * /getDataDashboard:
 *   get:
 *     summary: Obtener datos del dashboard.
 *     description: Obtiene información sobre los coches favoritos de los usuarios y crea un ranking de marcas y modelos.
 *     responses:
 *       200:
 *         description: Datos del dashboard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cochesPorUsuario:
 *                   type: object
 *                 rankingMarcas:
 *                   type: object
 *                 rankingModelos:
 *                   type: object
 *       500:
 *         description: Error interno del servidor al obtener información del dashboard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
const getDataDashboard = async (req, res) => {
  let db;
  try {
    // Conecta a la base de datos.
    db = await connectToDatabase();

    // Consulta la base de datos para obtener los datos de usuarios y sus coches favoritos.
    const userCarsData = await db.collection('userCars').find().toArray();
    const carsData = await db.collection('cars').find().toArray();

    // Crear un objeto para almacenar la información de coches por usuario.
    const cochesPorUsuario = {};

    // Procesar los datos para contar coches distintos por usuario y obtener la información de marca y modelo.
    for (const userCar of userCarsData) {
      const userName = userCar.userName;
      const carId = userCar.carId;

      if (!cochesPorUsuario[userName]) {
        cochesPorUsuario[userName] = { coches: [] };
      }

      // Consulta la información de marca y modelo en la colección "cars" utilizando el carId anidado.
      const carInfo = carsData.find(car => {
        return car.marcas.some(marca =>
          marca.modelos.some(modelo => modelo._id === carId)
        );
      });

      if (carInfo) {
        // Encuentra la marca y modelo correspondientes dentro de la estructura anidada.
        const marca = carInfo.marcas.find(marca =>
          marca.modelos.some(modelo => modelo._id === carId)
        );
        const modelo = marca.modelos.find(modelo => modelo._id === carId);

        cochesPorUsuario[userName].coches.push({
          marca: marca.nombre,
          modelo: modelo.nombre,
        });
      }
    }

    // Agregar el número de coches distintos en la respuesta.
    Object.keys(cochesPorUsuario).forEach(userName => {
      cochesPorUsuario[userName].numCoches = cochesPorUsuario[userName].coches.length;
    });

    // Crear objetos para el ranking de marcas y modelos.
    const rankingMarcas = {};
    const rankingModelos = {};

    // Procesar los datos para el ranking de marcas y modelos.
    for (const userName in cochesPorUsuario) {
      for (const coche of cochesPorUsuario[userName].coches) {
        const marca = coche.marca;
        const modelo = coche.modelo;

        if (!rankingMarcas[marca]) {
          rankingMarcas[marca] = 1;
        } else {
          rankingMarcas[marca]++;
        }

        if (!rankingModelos[modelo]) {
          rankingModelos[modelo] = 1;
        } else {
          rankingModelos[modelo]++;
        }
      }
    }

    // Ordenar los rankings de marcas y modelos de mayor a menor.
    const sortedRankingMarcas = Object.entries(rankingMarcas).sort((a, b) => b[1] - a[1]);
    const sortedRankingModelos = Object.entries(rankingModelos).sort((a, b) => b[1] - a[1]);

    // Crear un objeto de respuesta con la información de coches por usuario y los rankings ordenados.
    const response = {
      cochesPorUsuario,
      rankingMarcas: Object.fromEntries(sortedRankingMarcas),
      rankingModelos: Object.fromEntries(sortedRankingModelos),
    };

    // Enviar respuesta
    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener información del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener información del dashboard' });
  } finally {
    // Cierra la conexión a la base de datos de manera segura.
    closeDatabaseConnection();
  }
};


module.exports = {
  addFavoriteCar,
  getDataDashboard,
};
