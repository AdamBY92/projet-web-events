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
                <button onClick={() => openEdit(ev)}>Éditer</button>
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
