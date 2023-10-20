const express = require('express');
const { MongoClient } = require('mongodb');
const config = require('./config/config.js');
const crypto = require('crypto');
const database = require('./database/database.js');
const carData = require('./database/carData.json');
const userController = require('./controllers/userController');
const carController = require('./controllers/carController');
const userCarController = require('./controllers/userCarController');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig.js'); // Importa la configuración de Swagger
const routes = require('./routes/routes.js'); // Importa las rutas desde el archivo routes.js
const cors = require('cors');
app.use(cors({ origin: 'https://front-reco-react.onrender.com' }));
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const port = normalizePort(process.env.PORT || '3000');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

const url = config.mongoURL;
const dbName = config.dbName;
const client = new MongoClient(url, { useUnifiedTopology: true });

async function createDatabaseAndCollections() {
  try {
    const db = await database.connectToDatabase(client, dbName);

    // Crear la colección "users" si no existe
    await db.createCollection('users');
    console.log('Colección "users" creada o ya existe');

    // Verificar si la colección "users" está vacía e insertar datos de muestra si es así
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments({});
    if (userCount === 0) {
      const sampleUsers = Array.from({ length: 10 }, (_, i) => ({
        _id: generateRandomUserID(),
        password: 'recomotor',
      }));
      await usersCollection.insertMany(sampleUsers);
      console.log('Usuarios de ejemplo insertados en la colección "users"');
    }

    // Crear la colección "cars" si no existe
    await db.createCollection('cars');
    console.log('Colección "cars" creada o ya existe');

    // Crear la colección "userCars" para relaciones de usuarios con coches favoritos
    await db.createCollection('userCars');
    console.log('Colección "userCars" creada o ya existe');

    // Verificar si la colección "cars" está vacía e insertar datos de coches desde el archivo JSON
    const carsCollection = db.collection('cars');
    const carsCount = await carsCollection.countDocuments({});
    if (carsCount === 0) {
      for (const marca of carData.marcas) {
        for (const modelo of marca.modelos) {
          const modelID = generateModelID(marca.nombre, modelo.nombre);
          modelo._id = modelID;
        }
      }
      await carsCollection.insertOne(carData);
      console.log('Datos de coches de ejemplo insertados en la colección "cars"');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

function generateRandomUserID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateModelID(brand, model) {
  const concatenatedName = `${brand}_${model}`;
  return crypto.createHash('sha256').update(concatenatedName).digest('hex');
}

// Llamar a la función para crear la base de datos y las colecciones
createDatabaseAndCollections();

// Usa las rutas en tu aplicación
app.use('/', routes);

// Inicia el servidor aquí
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

//testing
/*const Mocha = require('mocha');
const mocha = new Mocha();
// Importamos archivos de prueba
mocha.addFile('./test/users.test.js');
// Ejecutamos las pruebas
mocha.run((failures) => {
  process.exit(failures);
});*/

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

// Exporta el objeto app
module.exports = app;