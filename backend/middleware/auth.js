const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les infos utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Accès refusé. Réservé aux administrateurs.' 
    });
  }
  next();
};

module.exports = { auth, isAdmin };