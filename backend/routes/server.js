const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion d\'événements' });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/events', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('Erreur MongoDB:', err));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend sur http://localhost:${PORT}`);
});