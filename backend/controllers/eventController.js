const Event = require('../models/Event');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

// Try to decode token if present (optional auth for GET)
function decodeOptionalToken(req) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

exports.createEvent = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user.id;

    const event = new Event(data);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const auth = decodeOptionalToken(req);
    const userId = auth?.id;

    const { startDate, endDate, category, status, search } = req.query;

    const query = { $and: [] };

    // Visibility: public OR owned by user
    if (userId) {
      query.$and.push({ $or: [{ isPublic: true }, { createdBy: userId }] });
    } else {
      query.$and.push({ isPublic: true });
    }

    if (startDate || endDate) {
      const range = {};
      if (startDate) range.$gte = new Date(startDate);
      if (endDate) range.$lte = new Date(endDate);
      query.$and.push({ date: range });
    }

    if (category) query.$and.push({ category });
    if (status) query.$and.push({ status });
    if (search) query.$and.push({ $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]});

    if (query.$and.length === 0) delete query.$and;

    const events = await Event.find(query).populate('createdBy', 'name email role').populate('category');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('createdBy', 'name email role').populate('category');
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // If not public, only owner or admin can view
    const auth = decodeOptionalToken(req);
    const userId = auth?.id;
    const userRole = auth?.role;

    if (!event.isPublic && !(userRole === 'admin' || String(event.createdBy._id) === String(userId))) {
      return res.status(403).json({ error: 'Accès refusé à cet événement' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Only owner or admin
    if (String(event.createdBy) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Action non autorisée' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Only owner or admin
    if (String(event.createdBy) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Action non autorisée' });
    }

    await event.remove();
    res.json({ message: 'Event supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
