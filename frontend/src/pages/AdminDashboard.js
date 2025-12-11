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

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement des statistiques...</p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Panel Administrateur</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalEvents}</h3>
            <p className="stat-label">Total Événements</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalRegistrations}</h3>
            <p className="stat-label">Total Inscriptions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalUsers}</h3>
            <p className="stat-label">Total Utilisateurs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.adminUsers}</h3>
            <p className="stat-label">Administrateurs</p>
          </div>
        </div>
      </div>

      <div className="popular-events-section">
        <h2 className="section-title">Événements Populaires</h2>
        {stats.popularEvents?.length > 0 ? (
          <div className="events-list">
            {stats.popularEvents.map(event => (
              <div key={event._id} className="event-item">
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-participants">
                    {event.currentParticipants}/{event.maxParticipants} participants
                  </p>
                </div>
                <div className="event-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Aucun événement populaire trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;