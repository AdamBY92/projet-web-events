import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GenericModal from '../components/GenericModal';
import EventForm from './EventForm';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingEvent(null);
    setModalOpen(true);
  }

  function openEdit(e) {
    setEditingEvent(e);
    setModalOpen(true);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Événements</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={openCreate}>Créer un événement</button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <ul>
          {events.map(ev => (
            <li key={ev._id} style={{ marginBottom: 10 }}>
              <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleString()}
              <div>
                {/* Show Edit/Delete only if current user is owner or admin */}
                {(currentUser && (currentUser.role === 'admin' || String(currentUser._id || currentUser.id) === String(ev.createdBy?._id || ev.createdBy))) && (
                  <>
                    <button onClick={() => openEdit(ev)}>Éditer</button>
                    <button onClick={async () => {
                      if (!token) return alert('Vous devez être connecté');
                      if (!confirm('Supprimer cet événement ?')) return;
                      try {
                        await axios.delete(`/api/events/${ev._id}`, { headers: { Authorization: `Bearer ${token}` } });
                        fetchEvents();
                      } catch (err) {
                        console.error(err);
                        alert('Erreur lors de la suppression');
                      }
                    }}>Supprimer</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <GenericModal isOpen={modalOpen} title={editingEvent ? 'Modifier événement' : 'Créer événement'} onClose={() => setModalOpen(false)} onSubmit={() => { /* submit handled inside form */ }}>
        <EventForm event={editingEvent} onDone={() => { setModalOpen(false); fetchEvents(); }} />
      </GenericModal>
    </div>
  );
}
