const express = require('express');
const userController = require('../controllers/userController');
const carController = require('../controllers/carController');
const userCarController = require('../controllers/userCarController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Rutas relacionadas con usuarios.
 */

/**
 * @swagger
 * tags:
 *   name: Coches
 *   description: Rutas relacionadas con coches.
 */

/**
 * @swagger
 * tags:
 *   name: Relaciones Usuario-Coches
 *   description: Rutas relacionadas con las relaciones entre usuarios y coches favoritos.
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un nuevo usuario.
 *     tags: [Usuarios]
 *     description: Registra un nuevo usuario en la aplicación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Usuario registrado con éxito.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de un usuario.
 *     tags: [Usuarios]
 *     description: Inicia sesión de un usuario en la aplicación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Usuario ha iniciado sesión con éxito.
 *       '401':
 *         description: Nombre de usuario o contraseña incorrectos.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/login', userController.loginUser);

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
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/cars', carController.getCars);

/**
 * @swagger
 * /userCars/addFavoriteCar:
 *   post:
 *     summary: Agregar un coche como favorito.
 *     tags: [Relaciones Usuario-Coches]
 *     description: Agrega un coche como favorito para un usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               carId:
 *                 type: string
 *             required:
 *               - userId
 *               - carId
 *     responses:
 *       '200':
 *         description: Coche agregado a favoritos con éxito.
 *       '400':
 *         description: El coche ya está en la lista de favoritos del usuario.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/userCars/addFavoriteCar', userCarController.addFavoriteCar);

module.exports = router;
