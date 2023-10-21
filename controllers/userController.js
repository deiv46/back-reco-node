const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connectToDatabase } = require('../database/database');
const { jwtSecretKey } = require('../config/config.js');
const User = require('../models/userModel'); // Asume que tienes un modelo de usuario

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión como usuario.
 *     tags: [Usuarios]
 *     description: Inicia sesión como usuario y obtiene un token JWT válido.
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
 *             example:
 *               username: "usuarioExistente"
 *               password: "contraseña123"
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 token:
 *                   type: string
 *                   example: "jwt.token.aqui"
 *       '401':
 *         description: Nombre de usuario o contraseña incorrectos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nombre de usuario o contraseña incorrectos
 *       '500':
 *         description: Error interno del servidor.
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await connectToDatabase();
    const users = await db.collection('users').find({ username }).toArray();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión', error: error.message });
  } finally {
    // Cierra la conexión a la base de datos de manera segura.
    closeDatabaseConnection();
  }
};

// Otros controladores relacionados con usuarios (actualizar información, cambiar contraseña, etc.)

module.exports = {
  loginUser,
};
