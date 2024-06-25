const path = require('path');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//Crear servidor express
const app = express();

//Bade de Datos
dbConnection();

//CORS
app.use(cors());

//Directorio Público
app.use(express.static('public'));

//Lesctura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
