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
    <div>
      <h1>Gestion d'Événements</h1>
      {token ? (
        <div>
          <p>Bonjour, {user.name}!</p>
          <Link to="/my-registrations">Mes Inscriptions</Link>
          {user.role === 'admin' && <Link to="/admin">Panel Admin</Link>}
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <div>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </div>
      )}
    </div>
  );
};

export default Home;