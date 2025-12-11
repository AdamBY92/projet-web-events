import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Panel Administrateur</h1>
      <div>
        <h2>Statistiques</h2>
        <p>Total Événements: {stats.totalEvents}</p>
        <p>Total Inscriptions: {stats.totalRegistrations}</p>
        <p>Total Utilisateurs: {stats.totalUsers}</p>
        <p>Administrateurs: {stats.adminUsers}</p>
        <h3>Événements Populaires</h3>
        <ul>
          {stats.popularEvents?.map(event => (
            <li key={event._id}>
              {event.title} - {event.currentParticipants}/{event.maxParticipants} participants
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;