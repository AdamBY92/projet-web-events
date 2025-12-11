const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management')
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require('./routes/auth');
const registrationRoutes = require('./routes/registration');
const adminRoutes = require('./routes/adminRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion d\'événements' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend sur http://localhost:${PORT}`);
  console.log(`Testez: curl http://localhost:${PORT}/`);
  console.log(`Inscription: curl -X POST http://localhost:${PORT}/api/auth/register -H "Content-Type: application/json" -d "{\\"name\\":\\"Test\\",\\"email\\":\\"test@test.com\\",\\"password\\":\\"test123\\"}"`);
});