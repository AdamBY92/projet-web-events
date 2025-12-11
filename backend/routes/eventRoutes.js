const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/eventController');
const { auth } = require('../middleware/auth');

// Public listing with optional filters (shows public events, or owned+public when token provided)
router.get('/', eventCtrl.getEvents);
router.get('/:id', eventCtrl.getEventById);

// Protected routes: create, update, delete
router.post('/', auth, eventCtrl.createEvent);
router.put('/:id', auth, eventCtrl.updateEvent);
router.delete('/:id', auth, eventCtrl.deleteEvent);

module.exports = router;
