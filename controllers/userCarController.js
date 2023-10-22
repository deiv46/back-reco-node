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
      await db.collection('userCars').deleteOne({ userName, carId });
      res.status(200).json({ message: 'Coche eliminado de favoritos con éxito' });
    } else {
      await db.collection('userCars').insertOne({
        userName,
        carId,
      });
      res.status(200).json({ message: 'Coche agregado a favoritos con éxito' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al gestionar el coche en favoritos' });
  } finally {
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
  try {
    const db = await connectToDatabase();
    const userCarsData = await db.collection('userCars').find().toArray();
    const carsData = await db.collection('cars').find().toArray();

    const cochesPorUsuario = {};

    for (const userCar of userCarsData) {
      const userName = userCar.userName;
      const carId = userCar.carId;

      if (!cochesPorUsuario[userName]) {
        cochesPorUsuario[userName] = { coches: [] };
      }

      const carInfo = carsData.find(car => car.marcas.some(marca =>
        marca.modelos.some(modelo => modelo._id === carId)
      ));

      if (carInfo) {
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

    Object.keys(cochesPorUsuario).forEach(userName => {
      cochesPorUsuario[userName].numCoches = cochesPorUsuario[userName].coches.length;
    });

    const rankingMarcas = {};
    const rankingModelos = {};

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

    const sortedRankingMarcas = Object.entries(rankingMarcas).sort((a, b) => b[1] - a[1]);
    const sortedRankingModelos = Object.entries(rankingModelos).sort((a, b) => b[1] - a[1]);

    const response = {
      cochesPorUsuario,
      rankingMarcas: Object.fromEntries(sortedRankingMarcas),
      rankingModelos: Object.fromEntries(sortedRankingModelos),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener información del dashboard' });
  } finally {
    closeDatabaseConnection();
  }
};

module.exports = {
  addFavoriteCar,
  getDataDashboard,
};