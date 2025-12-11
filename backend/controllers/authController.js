const jwt = require('jsonwebtoken');

// Utilisateurs simulés (en mémoire)
let users = [];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Simuler un ID MongoDB
    const userId = Date.now().toString();
    
    // "Sauvegarder" l'utilisateur
    const user = { 
      _id: userId,
      name, 
      email, 
      password, // Note: en réel, il faudrait hacher le mot de passe
      role: role || 'user' 
    };
    users.push(user);

    // Générer un token JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret-par-defaut',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès (mode simulation)',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérifier le mot de passe (simplifié)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret-par-defaut',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie (mode simulation)',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };