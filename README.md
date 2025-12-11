# projet-web-events

Application de gestion d'événements avec inscription et administration.

## Installation

### Prérequis
- Node.js
- MongoDB

### Backend
1. `cd backend`
2. `npm install`
3. Démarrer MongoDB
4. `npm run seed` (pour peupler la DB)
5. `npm run dev` (pour développement)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Utilisation
- Inscription/Connexion
- Utilisateurs peuvent voir et gérer leurs inscriptions
- Admins peuvent accéder au panel stats via /admin

## API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/registrations (auth)
- POST /api/registrations (auth)
- DELETE /api/registrations/:id (auth)
- GET /api/admin/stats (admin only)