# Notes App

A full-stack notes application built with Node.js/Express backend and Vite/React frontend.

## Project Structure

```
notes-app/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/   # Database and external service configs
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/   # Data models
│   │   └── routes/   # API routes
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # Vite/React frontend
│   ├── src/         # React components and logic
│   ├── public/      # Static assets
│   └── package.json # Frontend dependencies
└── README.md        # This file
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

- Create, read, update, and delete notes
- Modern React frontend with Vite
- Express.js REST API
- Database integration
- Rate limiting
- Environment variable management

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories as needed for your configuration. 