# Pageant Voting System - Client

Frontend application for the Pageant Voting System built with React and Material UI.

## Features

- Admin dashboard to manage events, judges, and candidates
- Judge voting interface with rating system
- Real-time results display
- Role-based authentication and authorization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

To run the application in development mode:

```bash
npm start
```

The application will start on `http://localhost:3000` and will connect to the backend server at `http://localhost:5000`.

## Environment Variables

If needed, create a `.env` file in the root of the client directory with the following:

```
REACT_APP_API_URL=http://localhost:5000
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Runs tests
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Dependencies

- React 18+
- React Router v6
- Material UI
- Axios for API calls
- JWT Decode for token handling