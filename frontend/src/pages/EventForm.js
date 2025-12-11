import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventForm({ event, onDone }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event ? new Date(event.date).toISOString().slice(0,16) : '');
  const [location, setLocation] = useState(event?.location || '');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setDate(event.date ? new Date(event.date).toISOString().slice(0,16) : '');
      setLocation(event.location || '');
    }
  }, [event]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { title, description, date: new Date(date), location };

    try {
      if (event) {
        await axios.put(`/api/events/${event._id}`, payload);
      } else {
        await axios.post('/api/events', payload);
      }
      if (onDone) onDone();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Date</label>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Lieu</label>
        <input value={location} onChange={e => setLocation(e.target.value)} required />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Sauvegarder</button>
      </div>
    </form>
  );
}
