const express = require('express');
const router = express.Router();
const { getUserRegistrations, registerForEvent, cancelRegistration } = require('../controllers/registrationController');
const { auth } = require('../middleware/auth');

// GET /api/registrations - Mes inscriptions
router.get('/', auth, getUserRegistrations);

// POST /api/registrations - S'inscrire à un événement
router.post('/', auth, registerForEvent);

// DELETE /api/registrations/:id - Annuler une inscription
router.delete('/:id', auth, cancelRegistration);

module.exports = router;