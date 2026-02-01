# Pageant Voting System

A full-stack web application for managing pageant events, judge voting, and results display.

## Overview

The Pageant Voting System is a complete solution for organizing and managing pageant competitions with digital voting capabilities. The system features role-based access control for administrators and judges, allowing secure and efficient vote collection and tabulation.

## Features

### Admin Features
- Create and manage pageant events
- Register and manage contestants
- Add and manage judges
- View real-time voting results
- Manage system users

### Judge Features
- Secure login with individual credentials
- Rate contestants using a 10-point scale
- Submit votes for multiple contestants
- View their own submitted votes

### General Features
- Real-time results calculation
- Secure authentication and authorization
- Responsive design for various devices
- Data persistence with MongoDB
- Modern UI with Material-UI

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - Component-based UI library
- **React Router** - Client-side routing
- **Material-UI** - Component library
- **Axios** - HTTP client
- **JWT Decode** - Token decoding

## Architecture

The application follows a Model-View-Controller (MVC) pattern with separation between frontend and backend:

```
pageant-voting-system/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── views/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── services/       # API service
│   │   └── App.js          # Main application component
│   └── package.json        # Frontend dependencies
├── server/                 # Express backend
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── start.sh                # Startup script (Linux/Mac)
└── start.bat               # Startup script (Windows)
```

## Database Models

### User Model
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: ['admin', 'judge'], default: 'judge')
- isActive: Boolean (default: true)

### Event Model
- name: String (required)
- description: String
- date: Date (required)
- isActive: Boolean (default: true)

### Candidate Model
- name: String (required)
- number: String (required)
- eventId: ObjectId (ref: 'Event', required)
- isActive: Boolean (default: true)

### Vote Model
- candidate: ObjectId (ref: 'Candidate', required)
- event: ObjectId (ref: 'Event', required)
- judge: ObjectId (ref: 'User', required)
- score: Number (required, min: 0, max: 10)
- createdAt: Date (default: Date.now)

## API Endpoints

### Authentication
- POST `/api/auth` - Login and get JWT token

### Users
- GET `/api/users` - Get all users (admin only)
- POST `/api/users` - Create a new user (admin only)
- PUT `/api/users/:id` - Update a user (admin only)
- DELETE `/api/users/:id` - Delete a user (admin only)

### Events
- GET `/api/events` - Get all events
- POST `/api/events` - Create a new event (admin only)
- PUT `/api/events/:id` - Update an event (admin only)
- DELETE `/api/events/:id` - Delete an event (admin only)

### Candidates
- GET `/api/candidates` - Get all candidates
- POST `/api/candidates` - Create a new candidate (admin only)
- PUT `/api/candidates/:id` - Update a candidate (admin only)
- DELETE `/api/candidates/:id` - Delete a candidate (admin only)

### Votes
- GET `/api/votes` - Get all votes (admin only)
- POST `/api/votes` - Submit votes (judge only)
- PUT `/api/votes/:id` - Update a vote (judge for own votes)
- DELETE `/api/votes/:id` - Delete a vote (admin only)

## Security Features

- Passwords are securely hashed using bcrypt
- JWT tokens for stateless authentication
- Role-based access control
- Input validation and sanitization
- Protection against common vulnerabilities

## Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Update the values as needed

4. Make sure MongoDB is running locally or update the connection string

5. Start the application:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`

## Usage

### Admin Account Setup
1. Create an admin account through the API or directly in the database
2. Log in to the admin dashboard
3. Create events and add contestants
4. Create judge accounts
5. Monitor voting and results

### Judge Voting Process
1. Judges receive individual login credentials
2. Judges log in to the voting interface
3. Judges rate contestants using the 10-point scale
4. Judges submit their votes
5. Results are calculated in real-time

## Development

This project was developed with a focus on:
- Clean, maintainable code
- Proper separation of concerns
- Security best practices
- Responsive user interface
- Comprehensive error handling

## Deployment

For production deployment:
1. Set NODE_ENV to 'production'
2. Configure a production-ready MongoDB instance
3. Set up proper JWT secrets
4. Configure reverse proxy (nginx/Apache) if needed
5. Implement proper logging and monitoring

## Contributing

This system provides a solid foundation for pageant voting. Possible enhancements include:
- Email notifications
- Advanced reporting features
- Mobile app version
- Integration with payment systems
- Multi-language support
- Additional scoring methods
- Backup and recovery procedures

## License

This project is created for educational and demonstration purposes.