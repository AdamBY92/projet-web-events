import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/registrations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRegistrations(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement de vos inscriptions...</p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mes Inscriptions</h1>
      </div>
      {registrations.length === 0 ? (
        <div className="empty-state">
          <h2>Aucune inscription trouvée</h2>
          <p>Vous n'êtes inscrit à aucun événement pour le moment.</p>
        </div>
      ) : (
        <div className="registrations-grid">
          {registrations.map(reg => (
            <div key={reg._id} className="registration-card">
              <div className="card-header">
                <h3 className="card-title">{reg.event.title}</h3>
              </div>
              <div className="card-body">
                <div className="event-info">
                  <p><strong>Date:</strong> {new Date(reg.event.date).toLocaleDateString()}</p>
                  <p><strong>Lieu:</strong> {reg.event.location}</p>
                  <p><strong>Description:</strong> {reg.event.description}</p>
                </div>
                <button
                  onClick={() => cancelRegistration(reg._id)}
                  className="btn btn-danger"
                >
                  Annuler l'inscription
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;