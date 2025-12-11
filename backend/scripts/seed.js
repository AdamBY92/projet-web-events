const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management');

const seedDB = async () => {
  try {
    // Vider les collections
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    // Créer des utilisateurs
    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'user123', role: 'user' },
    ]);

    // Créer des événements
    const events = await Event.insertMany([
      {
        title: 'Conférence Tech',
        description: 'Une conférence sur les nouvelles technologies',
        date: new Date('2025-12-20'),
        location: 'Paris',
        maxParticipants: 100,
        createdBy: users[0]._id,
      },
      {
        title: 'Atelier React',
        description: 'Apprendre React en pratique',
        date: new Date('2025-12-25'),
        location: 'Lyon',
        maxParticipants: 50,
        createdBy: users[0]._id,
      },
      {
        title: 'Meetup JS',
        description: 'Rencontre des développeurs JavaScript',
        date: new Date('2026-01-10'),
        location: 'Marseille',
        maxParticipants: 30,
        createdBy: users[0]._id,
      },
    ]);

    // Créer des inscriptions
    await Registration.insertMany([
      { user: users[1]._id, event: events[0]._id },
      { user: users[1]._id, event: events[1]._id },
      { user: users[2]._id, event: events[0]._id },
      { user: users[2]._id, event: events[2]._id },
    ]);

    // Mettre à jour currentParticipants
    await Event.findByIdAndUpdate(events[0]._id, { currentParticipants: 2 });
    await Event.findByIdAndUpdate(events[1]._id, { currentParticipants: 1 });
    await Event.findByIdAndUpdate(events[2]._id, { currentParticipants: 1 });

    console.log('Base de données seedée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedDB();