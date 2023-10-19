const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { jwtSecretKey } = require('../config/config.js');
const User = require('../models/userModel'); // Asume que tienes un modelo de usuario

// Controlador para el registro de usuarios
const registerUser = async (req, res) => {
  // Lógica para registrar un nuevo usuario (crear un documento de usuario en la base de datos)
  // Debes validar los datos y encriptar la contraseña antes de almacenarla en la base de datos

  try {
    // Ejemplo de encriptación de contraseña
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Crea un nuevo usuario en la base de datos con los datos proporcionados
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      // Otras propiedades del usuario
    });

    await newUser.save();

    // Genera un token JWT y lo envía como respuesta al registro exitoso
    const token = jwt.sign({ userId: newUser._id }, jwtSecretKey, { expiresIn: '1h' });

    res.json({ message: 'Usuario registrado con éxito', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro de usuario' });
  }
};

// Controlador para el inicio de sesión de usuarios
const loginUser = async (req, res) => {
  // Lógica para autenticar a un usuario (comprobar las credenciales)

  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Genera un token JWT y lo envía como respuesta al inicio de sesión exitoso
    const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
};

// Otros controladores relacionados con usuarios (actualizar información, cambiar contraseña, etc.)

module.exports = {
  registerUser,
  loginUser,
  // Otros controladores
};
