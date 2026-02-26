
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const dns = require('dns');// quitar
dns.setServers(['8.8.8.8', '8.8.4.4']);//quitar

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log('MongoDB Atlas conectado'))
  .catch(err=>console.error(err));

app.use('/api/auth', authRoutes);
app.listen(5000, () => console.log('Server en puerto 5000'));
