const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

module.exports = {
  // GET /api/admin/stats - Statistiques admin
  stats: async (req, res) => {
    try {
      const totalEvents = await Event.countDocuments();
      const totalRegistrations = await Registration.countDocuments();
      const totalUsers = await User.countDocuments();
      const adminUsers = await User.countDocuments({ role: 'admin' });

      // Événements populaires (top 5 par inscriptions)
      const popularEvents = await Event.find()
        .sort({ currentParticipants: -1 })
        .limit(5)
        .select('title currentParticipants maxParticipants');

      res.json({
        totalEvents,
        totalRegistrations,
        totalUsers,
        adminUsers,
        popularEvents
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};