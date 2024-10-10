const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

const app = express();
app.use(cors());  // Adicione isso para permitir requisições entre domínios
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', roomRoutes);

module.exports = app;
