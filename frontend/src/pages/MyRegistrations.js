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

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Mes Inscriptions</h1>
      {registrations.length === 0 ? (
        <p>Vous n'êtes inscrit à aucun événement.</p>
      ) : (
        <ul>
          {registrations.map(reg => (
            <li key={reg._id}>
              <h3>{reg.event.title}</h3>
              <p>Date: {new Date(reg.event.date).toLocaleDateString()}</p>
              <p>Lieu: {reg.event.location}</p>
              <button onClick={() => cancelRegistration(reg._id)}>Annuler</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRegistrations;