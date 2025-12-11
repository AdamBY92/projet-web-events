import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Gestion d'Événements</h1>
        <p className="hero-subtitle">Découvrez et inscrivez-vous aux événements les plus passionnants</p>
        {token ? (
          <div className="hero-actions">
            <p className="welcome-message">Bonjour, {user.name}!</p>
            <div className="action-buttons">
              <Link to="/my-registrations" className="btn btn-primary">Mes Inscriptions</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary">Panel Admin</Link>
              )}
              <button onClick={logout} className="btn btn-outline">Déconnexion</button>
            </div>
          </div>
        ) : (
          <div className="hero-actions">
            <div className="action-buttons">
              <Link to="/login" className="btn btn-primary">Connexion</Link>
              <Link to="/register" className="btn btn-secondary">Inscription</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;