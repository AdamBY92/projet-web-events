const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la connexion PostgreSQL avec Sequelize
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/events_db',
  {
    dialect: 'postgres',
    logging: false, // Désactiver les logs SQL en production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Tester la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Connexion PostgreSQL établie avec succès');
  } catch (error) {
    console.error('✗ Impossible de se connecter à PostgreSQL:', error.message);
  }
};

module.exports = { sequelize, Sequelize, testConnection };
