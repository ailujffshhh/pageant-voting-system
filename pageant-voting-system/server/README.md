# Pageant Voting System - Server

Backend API for the Pageant Voting System built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (JWT)
- Role-based access control (admin/judge)
- Event management
- Candidate registration
- Voting system
- Results calculation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file in the server directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pageant-voting
JWT_SECRET=your_jwt_secret_here
```

## Running the Application

To run the application in development mode:

```bash
npm run dev
```

To run in production mode:

```bash
npm start
```

The server will start on the configured port (default: 5000).

## API Endpoints

### Authentication
- POST `/api/auth` - Login and get JWT token

### Users
- GET `/api/users` - Get all users (requires admin role)
- POST `/api/users` - Create a new user (requires admin role)
- PUT `/api/users/:id` - Update a user (requires admin role)
- DELETE `/api/users/:id` - Delete a user (requires admin role)

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get a specific event
- POST `/api/events` - Create a new event (requires admin role)
- PUT `/api/events/:id` - Update an event (requires admin role)
- DELETE `/api/events/:id` - Delete an event (requires admin role)

### Candidates
- GET `/api/candidates` - Get all candidates
- GET `/api/candidates/:id` - Get a specific candidate
- POST `/api/candidates` - Create a new candidate (requires admin role)
- PUT `/api/candidates/:id` - Update a candidate (requires admin role)
- DELETE `/api/candidates/:id` - Delete a candidate (requires admin role)

### Votes
- GET `/api/votes` - Get all votes (requires admin role)
- GET `/api/votes/:id` - Get a specific vote
- POST `/api/votes` - Submit votes (requires judge role)
- DELETE `/api/votes/:id` - Delete a vote (requires admin role)

## Database Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required)
- role (String, enum: ['admin', 'judge'], default: 'judge')
- isActive (Boolean, default: true)

### Event
- name (String, required)
- description (String)
- date (Date, required)
- isActive (Boolean, default: true)

### Candidate
- name (String, required)
- number (String, required)
- eventId (ObjectId, ref: 'Event', required)
- isActive (Boolean, default: true)

### Vote
- candidate (ObjectId, ref: 'Candidate', required)
- event (ObjectId, ref: 'Event', required)
- judge (ObjectId, ref: 'User', required)
- score (Number, required, min: 0, max: 10)
- createdAt (Date, default: Date.now)

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control prevents unauthorized actions
- Input validation is performed using express-validator