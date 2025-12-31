# CRM Application

## Setup & Run

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Backend
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Start server: `npm run dev` (or `node server.js`)
   - Server runs on `http://localhost:5000`

### Frontend
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
   - App runs on `http://localhost:5173`

## Features implemented
- **Backend**: MVC Architecture, JWT Authentication, Role-based access control (Admin/Staff), Lead CRUD, Assignment Logic.
- **Frontend**: Vite + React, Tailwind CSS, Zustand State Management, Protected Routes, Lead Management UI with Assignment.

## Default Roles
- **Admin**: Can create, edit, delete, and assign leads.
- **Staff**: Can only view leads assigned to them.
