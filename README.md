# Rubies - Transaction Management System

A full-stack web application for managing financial transactions with a React frontend and Node.js/Express backend.

## 🚀 Features

- Transaction tracking and management
- MongoDB database integration
- Secure API with authentication
- Modern React UI with Vite
- RESTful API architecture

## 📁 Project Structure

```
Rubies/
├── backend/          # Node.js/Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Server entry point
└── client/           # React frontend
    ├── src/          # React components
    └── public/       # Static assets
```

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS
- dotenv

### Frontend
- React 19
- Vite
- Redux Toolkit
- Axios
- Bootstrap & Reactstrap
- React Calendar

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
API_SECRET=your_secret_key
```

### Frontend (.env)
```
VITE_API_SECRET=your_secret_key
VITE_API_URL=your_backend_api_url
```

## 📦 Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 🌐 Deployment

This application is configured for deployment on Render.com:
- Backend: Web Service
- Frontend: Static Site
- Database: MongoDB Atlas

## 📝 License

ISC
