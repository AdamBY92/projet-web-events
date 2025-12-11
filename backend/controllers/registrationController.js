const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.userId })
      .populate('event', 'title date location')
      .sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId;

    // Vérifier si l'événement existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
      return res.status(400).json({ error: 'Vous êtes déjà inscrit à cet événement' });
    }

    // Vérifier les places disponibles
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ error: 'Événement complet' });
    }

    // Créer l'inscription
    const registration = new Registration({ user: userId, event: eventId });
    await registration.save();

    // Mettre à jour le nombre de participants
    event.currentParticipants += 1;
    await event.save();

    res.status(201).json({ message: 'Inscription réussie', registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Trouver l'inscription
    const registration = await Registration.findOne({ _id: id, user: userId });
    if (!registration) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }

    // Supprimer l'inscription
    await Registration.findByIdAndDelete(id);

    // Mettre à jour le nombre de participants
    const event = await Event.findById(registration.event);
    if (event) {
      event.currentParticipants = Math.max(0, event.currentParticipants - 1);
      await event.save();
    }

    res.json({ message: 'Inscription annulée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserRegistrations, registerForEvent, cancelRegistration };